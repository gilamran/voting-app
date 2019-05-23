import { Card, CardActions, CardContent, CardHeader, Grid } from '@material-ui/core';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { IQuestion } from '../types/IQuestion';
import { AddQuestion } from './AddQuestion';
import { Question } from './Question';

const styles = (theme: Theme) =>
  createStyles({
    root: {},
    card: {
      backgroundColor: '#f3f3f3',
    },
    actions: {
      marginLeft: theme.spacing.unit,
      marginBottom: theme.spacing.unit,
    },
  });

interface IProps extends WithStyles<typeof styles> {
  onNewQuestion(question: IQuestion): void;
  onVoted(questionIdx: number, answerIdx: number): void;
  canVote: boolean;
  canAddQuestions: boolean;
  questionsList: IQuestion[];
}

export const QuestionsList = withStyles(styles)(
  class extends React.Component<IProps> {
    public render() {
      const { classes, questionsList, onNewQuestion, canAddQuestions, canVote } = this.props;

      return (
        <Grid container spacing={16} className={classes.root}>
          <Grid item xs={12}>
            <Card className={classes.card}>
              <CardHeader title='Questions' />
              <CardContent>
                <Grid item xs={12}>
                  <Grid container spacing={16}>
                    {questionsList.map((q, questionIdx) => (
                      <Grid item xs={12} key={questionIdx}>
                        <Question
                          canVote={canVote}
                          question={q}
                          onVoted={answerIdx => this.props.onVoted(questionIdx, answerIdx)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </CardContent>
              {canAddQuestions ? (
                <CardActions className={classes.actions}>
                  <AddQuestion onNewQuestion={onNewQuestion} />
                </CardActions>
              ) : null}
            </Card>
          </Grid>
        </Grid>
      );
    }
  },
);
