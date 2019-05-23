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
import { getMyAccount } from '../orbs-gateway/my-account';
import { AccountInfo } from './AccountInfo';
import { Grid } from '@material-ui/core';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing.unit * 3,
    },
  });

interface IProps extends WithStyles<typeof styles> {}
interface IState {
  questionsList: IQuestion[];
  votersList: IVoter[];
  owner: boolean;
}

export const Home = withStyles(styles)(
  class extends React.Component<IProps, IState> {
    constructor(props: IProps) {
      super(props);
      this.state = { questionsList: [], votersList: [], owner: false };
    }

    public async componentWillMount() {
      try {
        await this.createContract();
      } finally {
        this.schedualReloadData();
      }
    }

    public render() {
      const { classes } = this.props;
      return (
        <div className={classes.root}>
          <Grid container spacing={16} className={classes.root}>
            <Grid item xs={4}>
              <AccountInfo />
              <VotersList
                onNewVoter={v => this.onNewVoter(v)}
                canAddVoter={this.state.owner}
                votersList={this.state.votersList}
              />
            </Grid>
            <Grid item xs={8}>
              <QuestionsList
                canAddQuestions={this.state.owner}
                canVote={this.calcCanVote()}
                questionsList={this.state.questionsList}
                onNewQuestion={q => this.onNewQuestion(q)}
                onVoted={(qId, answer) => this.onVoted(qId, answer)}
              />
            </Grid>
          </Grid>
        </div>
      );
    }

    private calcCanVote(): boolean {
      const result =
        this.state.votersList.find(v => {
          return '0x' + v.Address.toLowerCase() === getMyAccount().address.toLowerCase();
        }) !== undefined;

      return result;
    }
    private async createContract(): Promise<void> {
      await uploadVotingContract();
    }

    private async schedualReloadData(): Promise<void> {
      await this.reloadData();
      setTimeout(() => this.schedualReloadData(), 2000);
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
      this.setState({ votersList: allVoters });
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
      await setVoterWeight(voter.Address, voter.Weight);
      this.reloadData();
    }

    private async onVoted(questionIdx: number, answerIdx: number): Promise<void> {
      await vote(questionIdx, answerIdx);
      this.reloadData();
    }
  },
);
