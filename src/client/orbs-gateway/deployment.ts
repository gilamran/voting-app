import * as Orbs from 'orbs-client-sdk/dist/index.es.js';
import { IQuestion } from '../types/IQuestion';
import { CONTRACT_CODE } from './contract';
import { getMyAccount } from './my-account';
import { IVoter } from '../types/IVoter';

const { argUint32, argString, argBytes, Client } = Orbs;

const myAccount = getMyAccount();
const ORBS_END_POINT = 'http://localhost:8080';
const ORBS_VCHAIN_ID = 42;
const client = new Client(ORBS_END_POINT, ORBS_VCHAIN_ID, 'MAIN_NET');
export async function uploadVotingContract(): Promise<void> {
  const contractNameArg = argString('Voting');
  const contractLangArg = argUint32(1); // goLang
  const contractCodeArg = argBytes(new TextEncoder().encode(CONTRACT_CODE));
  const args = [contractNameArg, contractLangArg, contractCodeArg];

  const [tx, txId] = client.createTransaction(
    myAccount.publicKey,
    myAccount.privateKey,
    '_Deployments',
    'deployService',
    args,
  );

  const txResult = await client.sendTransaction(tx);
  console.log(txResult);
}

async function callVotingContract(func: string, ...params): Promise<any> {
  const [tx, txId] = client.createTransaction(myAccount.publicKey, myAccount.privateKey, 'Voting', func, params);
  const txResult = await client.sendTransaction(tx);
  if (txResult.executionResult !== 'SUCCESS') {
    console.log(txResult);
    throw new Error(txResult.executionResult);
  }
  if (txResult.outputArguments.length > 0) {
    console.log(`${func} returned`, txResult.outputArguments[0].value);
  }
  return txResult;
}

export async function isOwner(): Promise<boolean> {
  const txResult = await callVotingContract('getOwner');
  const ownerAddress = txResult.outputArguments[0].value;
  return '0x' + ownerAddress.toLowerCase() === myAccount.address.toLowerCase();
}

export async function getOwner(): Promise<void> {
  await callVotingContract('getOwner');
}

export async function getNumberOfQuestions(): Promise<number> {
  const txResult = await callVotingContract('getNumberOfQuestions');
  return txResult.outputArguments[0].value;
}

export async function addBoolQuestion(question: IQuestion): Promise<void> {
  const questionAsStringArg = argString(JSON.stringify(question));
  await callVotingContract('addBoolQuestion', questionAsStringArg);
}

export async function vote(questionIdx: number, voteIdx: number): Promise<void> {
  const questionIdxArg = argUint32(questionIdx);
  const voteArg = argUint32(voteIdx);
  await callVotingContract('vote', questionIdxArg, voteArg);
}

export async function setVoterWeight(voterAddress: string, weight: number): Promise<void> {
  const voterAddressArg = argString(voterAddress);
  const weightArg = argUint32(weight);
  await callVotingContract('setVoterWeight', voterAddressArg, weightArg);
}

export async function getAllVoters(): Promise<IVoter[]> {
  const txResult = await callVotingContract('getAllVoters');
  return JSON.parse(txResult.outputArguments[0].value);
}

export async function getQuestion(questionIdx: number): Promise<IQuestion> {
  const questionIdxArg = argUint32(questionIdx);
  const txResult1 = await callVotingContract('getQuestionString', questionIdxArg);
  const question: IQuestion = JSON.parse(txResult1.outputArguments[0].value);

  question.answers = [];
  const answerTitlesResult = await callVotingContract('getQuestionAnswerStrings', questionIdxArg);
  const answersTitles = JSON.parse(answerTitlesResult.outputArguments[0].value);
  for (let answerIdx = 0; answerIdx < answersTitles.length; answerIdx++) {
    const title = answersTitles[answerIdx];

    const answerIdxArg = argUint32(answerIdx);
    const totalVotesResult = await callVotingContract('getQuestionAnswerVote', questionIdxArg, answerIdxArg);
    const votersResult = await callVotingContract('getQuestionAnswerVoters', questionIdxArg, answerIdxArg);

    question.answers.push({
      title,
      voted: JSON.parse(votersResult.outputArguments[0].value),
      totalVotes: totalVotesResult.outputArguments[0].value,
    });
  }

  return question;
}
