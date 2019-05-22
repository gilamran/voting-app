import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { QuestionsList } from './QuestionsList';
import { IQuestion } from '../types/IQuestion';
import { getNumberOfQuestions, getQuestion, addBoolQuestion } from '../orbs-gateway/deployment';

const styles = (theme: Theme) =>
  createStyles({
    root: {},
  });

interface IProps extends WithStyles<typeof styles> {}
interface IState {
  questionsList: IQuestion[];
}

export const Home = withStyles(styles)(
  class extends React.Component<IProps, IState> {
    constructor(props: IProps) {
      super(props);
      this.state = { questionsList: [] };
    }

    public componentWillMount() {
      this.loadQuestions();
    }

    public render() {
      const { classes } = this.props;
      return (
        <div className={classes.root}>
          <QuestionsList questionsList={this.state.questionsList} onNewQuestion={q => this.onNewQuestion(q)} />
        </div>
      );
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
      this.loadQuestions();
    }
  },
);
