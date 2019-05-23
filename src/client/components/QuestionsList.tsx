import { Card, CardContent, CardHeader, Grid, Typography, Button } from '@material-ui/core';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { IQuestion } from '../types/IQuestion';
import { Question } from './Question';
import { AddQuestion } from './AddQuestion';
import { addBoolQuestion } from '../orbs-gateway/deployment';

const styles = (theme: Theme) =>
  createStyles({
    root: {},
  });

interface IProps extends WithStyles<typeof styles> {
  onNewQuestion(question: IQuestion): void;
  onVoted(questionIdx: number, answerIdx: number): void;
  canAddQuestions: boolean;
  questionsList: IQuestion[];
}

export const QuestionsList = withStyles(styles)(
  class extends React.Component<IProps> {
    public render() {
      const { classes, questionsList, onNewQuestion, canAddQuestions } = this.props;

      return (
        <div className={classes.root}>
          <Grid container spacing={16}>
            {questionsList.length > 0 ? (
              <div>
                <Grid item xs={12}>
                  <Typography variant={'h4'}>Questions</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={16}>
                    {questionsList.map((q, questionIdx) => (
                      <Grid item xs={12} key={questionIdx}>
                        <Question question={q} onVoted={answerIdx => this.props.onVoted(questionIdx, answerIdx)} />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </div>
            ) : null}
            {canAddQuestions ? (
              <Grid item xs={12}>
                <AddQuestion onNewQuestion={onNewQuestion} />
              </Grid>
            ) : null}
          </Grid>
        </div>
      );
    }
  },
);
