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
	vote, clearVoterFromQuestion,
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
	Weight uint32
}

func _formatVotersName() string {
	return "_Voters_"
}

func _getVoterMap() collections.Map {
	return collections.NewStructMap(_formatVotersName(), Voter{})
}

func getVoterWeight(address string) uint32 {
	voterMap := collections.NewStructMap(_formatVotersName(), Voter{})
	address = strings.ToLower(address)
	if voterMap.Contains(address) {
		return voterMap.Get(address).(Voter).Weight
	}
	return 0
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
		output = append(output, VoterWeight{address: key, weight: voterMap.Get(key).(Voter).Weight})
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

func _formatAnswerVotesKey(qId uint32, aId uint32) string {
	return fmt.Sprintf("_QnAVotes_%d_%d_", qId, aId)
}

func getQuestionAnswerVoters(qId uint32, aId uint32) string {
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

func getQuestionAnswerVote(qId uint32, aId uint32) uint32 {
	votersCollection := collections.NewUniqueList(_formatAnswerVotesKey(qId, aId),
		collections.DefaultStringSerializer,
		collections.DefaultStringDeserializer,
		collections.DefaultDeleter)

	voterMap := _getVoterMap()
	totalVote := uint32(0)
	votersCollection.Iterate(func(id uint64, item interface{}) bool {
		if voterMap.Contains(item.(string)) {
			totalVote = safeuint32.Add(totalVote, voterMap.Get(item.(string)).(Voter).Weight)
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
	err := json.Unmarshal([]byte(answers), &answerArray)
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
func clearVoterFromQuestion(qId uint32, address string) {
	answersStr := getQuestionAnswerStrings(qId)
	var answerArray []string
	err := json.Unmarshal([]byte(answersStr), &answerArray)
	if err != nil {
		panic(fmt.Sprintf("error while clearing old vote for answer %d: error %s", qId, err))
	}
	for i := range answerArray { // we don't care value only how many
		voters := collections.NewUniqueList(_formatAnswerVotesKey(qId, uint32(i)),
			collections.DefaultStringSerializer,
			collections.DefaultStringDeserializer,
			collections.DefaultDeleter)
		if voters.Contains(address) {
			voters.Remove(voters.IndexOf(address))
		}
	}
}

func _addVoterToQuestionAnswer(qId uint32, aId uint32, address string) {
	votersCollection := collections.NewUniqueList(_formatAnswerVotesKey(qId, aId),
		collections.DefaultStringSerializer,
		collections.DefaultStringDeserializer,
		collections.DefaultDeleter)

	votersCollection.Add(address)
}

func vote(qId uint32, aId uint32) {
	address := strings.ToLower(fmt.Sprintf("%x", address.GetSignerAddress()))
	voterMap := collections.NewStructMap(_formatVotersName(), Voter{})
	if !voterMap.Contains(address) {
		panic(fmt.Sprintf("voter %s, is not allowed to vote in this contract", address))
	}

	clearVoterFromQuestion(qId, address)
	_addVoterToQuestionAnswer(qId, aId, address)
}
