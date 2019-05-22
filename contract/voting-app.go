package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/orbs-network/contract-library-experiment/collections"
	"github.com/orbs-network/orbs-contract-sdk/go/sdk/v1"
	"github.com/orbs-network/orbs-contract-sdk/go/sdk/v1/address"
	"github.com/orbs-network/orbs-contract-sdk/go/sdk/v1/safemath/safeuint32"
	"github.com/orbs-network/orbs-contract-sdk/go/sdk/v1/state"
)

var PUBLIC = sdk.Export(
	getOwner,
	getVoterWeight, setVoterWeight, getAllVoters,
	getNumberOfQuestions, addBoolQuestion, addQuestion,
	getQuestionString, getQuestionAnswerStrings, getQuestionAnswerVote, getQuestionAnswerVoters,
	vote,
)
var SYSTEM = sdk.Export(_init)

func _init() {
	state.WriteBytes(_formatOwnerKey(), address.GetSignerAddress())
}

/***
 * owner
 */
func _formatOwnerKey() []byte {
	return []byte("_Owner_")
}

func getOwner() string {
	return fmt.Sprintf("%x", state.ReadBytes(_formatOwnerKey()))
}

func isOwner() bool {
	return bytes.Compare(address.GetSignerAddress(), state.ReadBytes(_formatOwnerKey())) == 0
}

/***
 * Voters
 */

type Voter struct {
	weight uint32
}

func _formatVotersName() string {
	return "_Voters_"
}

func getVoterWeight(address string) uint32 {
	voterMap := collections.NewStructMap(_formatVotersName(), Voter{})
	address = strings.ToLower(address)
	if voterMap.Contains(address) {
		return voterMap.Get(address).(Voter).weight
	}
	return 0
}

func _getVoterMap() collections.Map {
	return collections.NewStructMap(_formatVotersName(), Voter{})
}

func setVoterWeight(address string, weight uint32) {
	voters := _getVoterMap()
	address = strings.ToLower(address)
	if weight == 0 {
		voters.Remove(address)
	} else {
		voters.Put(address, Voter{weight})
	}
}

type VoterWeight struct {
	address string
	weight  uint32
}

func getAllVoters() string {
	voterMap := _getVoterMap()
	output := make([]VoterWeight, 0, voterMap.Count())
	voterMap.Iterate(func(key string, item interface{}) bool {
		output = append(output, VoterWeight{address: key, weight: voterMap.Get(key).(Voter).weight})
		return true
	})

	data, err := json.Marshal(output)
	if err != nil {
		panic(fmt.Sprintf("error while getting voter and weights: %s", err))
	}
	return string(data)
}

/***
 * Questions
 */
func _formatNumberOfQuestionsKey() []byte {
	return []byte("_Questions_")
}

func getNumberOfQuestions() uint32 {
	return state.ReadUint32(_formatNumberOfQuestionsKey())
}

func _advanceQuestionId() uint32 {
	qId := safeuint32.Add(getNumberOfQuestions(), 1)
	state.WriteUint32(_formatNumberOfQuestionsKey(), qId)
	return qId
}
func _formatQuestionStrKey(id uint32) []byte {
	return []byte(fmt.Sprintf("_QuestionStr_%d_", id))
}

func getQuestionString(id uint32) string {
	return state.ReadString(_formatQuestionStrKey(id))
}

func _setQuestionString(id uint32, question string) {
	state.WriteString(_formatQuestionStrKey(id), question)
}

func _formatQuestionAnswersKey(id uint32) []byte {
	return []byte(fmt.Sprintf("_QuestionAns_%d_", id))
}

func getQuestionAnswerStrings(id uint32) string {
	return string(state.ReadBytes(_formatQuestionAnswersKey(id)))
}

func _setQuestionAnswerStrings(id uint32, answers []string) {
	data, err := json.Marshal(answers)
	if err != nil {
		panic(fmt.Sprintf("error while saving answer strings %s", err))
	}
	state.WriteBytes(_formatQuestionAnswersKey(id), data)
}

func _formatAnswerVotesKey(qId uint32, aId int) string {
	return fmt.Sprintf("_QnAVotes_%d_%d_", qId, aId)
}

func getQuestionAnswerVoters(qId uint32, aId int) string {
	votersCollection := collections.NewUniqueList(_formatAnswerVotesKey(qId, aId),
		collections.DefaultStringSerializer,
		collections.DefaultStringDeserializer,
		collections.DefaultDeleter)

	var voters []string
	votersCollection.Iterate(func(id uint64, item interface{}) bool {
		voters = append(voters, item.(string))
		return true
	})

	data, err := json.Marshal(voters)
	if err != nil {
		panic(fmt.Sprintf("error while saving answer strings %s", err))
	}
	return string(data)
}

func _setQuestionAnswerVoters(qId uint32, aId int, address string) {
	votersCollection := collections.NewUniqueList(_formatAnswerVotesKey(qId, aId),
		collections.DefaultStringSerializer,
		collections.DefaultStringDeserializer,
		collections.DefaultDeleter)

	votersCollection.Add(address)
}

func getQuestionAnswerVote(qId uint32, aId int) uint32 {
	votersCollection := collections.NewUniqueList(_formatAnswerVotesKey(qId, aId),
		collections.DefaultStringSerializer,
		collections.DefaultStringDeserializer,
		collections.DefaultDeleter)

	voterMap := _getVoterMap()
	totalVote := uint32(0)
	votersCollection.Iterate(func(id uint64, item interface{}) bool {
		if voterMap.Contains(item.(string)) {
			totalVote = safeuint32.Add(totalVote, voterMap.Get(item.(string)).(Voter).weight)
		}
		return true
	})

	return totalVote
}

func addBoolQuestion(question string) uint32 {
	if !isOwner() {
		panic("User is not the owner of this questionnaire")
	}
	qId := getNumberOfQuestions()
	_setQuestionString(qId, question)
	_setQuestionAnswerStrings(qId, []string{"No", "Yes"})
	_advanceQuestionId()
	return qId
}

func addQuestion(question string, answers string) uint32 {
	if !isOwner() {
		panic("User is not the owner of this questionnaire")
	}
	qId := getNumberOfQuestions()
	_setQuestionString(qId, question)
	var answerArray []string
	err := json.Unmarshal([]byte(answers), answerArray)
	if err != nil {
		panic(fmt.Sprintf("error while adding answer strings %s", err))
	}
	_setQuestionAnswerStrings(qId, answerArray)
	_advanceQuestionId()
	return qId
}

/***
 * Vote
 */
func vote(qId uint32, aId uint32) {
	address := strings.ToLower(fmt.Sprintf("%x", address.GetSignerAddress()))
	voterMap := collections.NewStructMap(_formatVotersName(), Voter{})
	if !voterMap.Contains(address) {
		panic(fmt.Sprintf("voter %s, is not allowed to vote in this contract", address))
	} else {
		_setQuestionAnswerVoters(qId, int(aId), address)
	}
}

//
//
//type Answer struct {
//	answer string
//	voters collections.UniqueList
//}
//
//type Question struct {
//	question string
//	answers []Answer
//}
//
//func _formatQuestionKey(id uint32) []byte {
//	return []byte(fmt.Sprintf("_Question_%d_",id))
//}
//func _formatQuestionAnswerKey(qId uint32, aId int) string {
//	return fmt.Sprintf("_QnA_%d_%d_", qId, aId)
//}
//
//func newAnswer(qId uint32, aId int, answer string) *Answer {
//	return &Answer{ answer: answer,
//		voters:collections.NewUniqueList(
//			_formatQuestionAnswerKey(qId,aId),
//			collections.DefaultStringSerializer,
//			collections.DefaultStringDeserializer,
//			collections.DefaultDeleter),
//	}
//}
//
//func addBoolQuestion(question string) uint32 {
//	qId := _advanceQuestionId()
//	q := Question{
//		question:question,
//		answers:[]Answer{ *newAnswer(qId, 0, "No"), *newAnswer(qId, 1, "Yes")},
//	}
//	collections.DefaultStructSerializer(_formatQuestionKey(qId), q)
//	return qId
//}
//
//
