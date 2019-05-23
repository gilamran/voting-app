import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { QuestionsList } from './QuestionsList';
import { VotersList } from './VotersList';
import { IQuestion } from '../types/IQuestion';
import {
  getNumberOfQuestions,
  getQuestion,
  addBoolQuestion,
  vote,
  setVoterWeight,
  isOwner,
  uploadVotingContract,
  getAllVoters,
} from '../orbs-gateway/deployment';
import { IVoter } from '../types/IVoter';

const styles = (theme: Theme) =>
  createStyles({
    root: {},
  });

interface IProps extends WithStyles<typeof styles> {}
interface IState {
  questionsList: IQuestion[];
  owner: boolean;
}

export const Home = withStyles(styles)(
  class extends React.Component<IProps, IState> {
    constructor(props: IProps) {
      super(props);
      this.state = { questionsList: [], owner: false };
    }

    public async componentWillMount() {
      try {
        await this.createContract();
      } finally {
        this.reloadData();
      }
    }

    public render() {
      const { classes } = this.props;
      return (
        <div className={classes.root}>
          <VotersList onNewVoter={v => this.onNewVoter(v)} canAddVoter={this.state.owner} />
          <QuestionsList
            canAddQuestions={this.state.owner}
            questionsList={this.state.questionsList}
            onNewQuestion={q => this.onNewQuestion(q)}
            onVoted={(qId, answer) => this.onVoted(qId, answer)}
          />
        </div>
      );
    }

    private async createContract(): Promise<void> {
      await uploadVotingContract();
    }

    private async reloadData(): Promise<void> {
      await this.loadQuestions();
      await this.loadVoters();
      await this.loadIsOwner();
    }

    private async loadIsOwner(): Promise<void> {
      const owner = await isOwner();
      this.setState({ owner });
    }

    private async loadVoters(): Promise<void> {
      const allVoters = await getAllVoters();
    }

    private async loadQuestions(): Promise<void> {
      const questionsList: IQuestion[] = [];
      const numOfQuestions = await getNumberOfQuestions();
      for (let i = 0; i < numOfQuestions; i++) {
        const question = await getQuestion(i);
        questionsList.push(question);
      }
      this.setState({ questionsList });
    }

    private async onNewQuestion(question: IQuestion) {
      await addBoolQuestion(question);
      this.reloadData();
    }

    private async onNewVoter(voter: IVoter) {
      await setVoterWeight(voter.address, voter.weight);
      this.reloadData();
    }

    private async onVoted(questionIdx: number, answerIdx: number): Promise<void> {
      await vote(questionIdx, answerIdx);
      this.reloadData();
    }
  },
);
