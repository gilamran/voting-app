import { Card, CardContent, CardHeader, Typography } from '@material-ui/core';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { IQuestion } from '../types/IQuestion';
import { Vote } from './Vote';
import { Doughnut } from 'react-chartjs-2';

const styles = (theme: Theme) =>
  createStyles({
    root: {},
    content: {},
    dataContainer: {
      display: 'flex',
      minHeight: 120,
    },
    description: {
      flex: 1,
    },
  });

interface IProps extends WithStyles<typeof styles> {
  question: IQuestion;
  canVote: boolean;
  onVoted(answerIdx: number): void;
}

export const Question = withStyles(styles)(({ classes, question, onVoted, canVote }: IProps) => {
  if (question.answers.length === 0) {
    return null;
  }

  console.log('canVote', canVote);
  const data = {
    labels: question.answers.map(a => a.title),
    datasets: [
      {
        data: question.answers.map(a => a.totalVotes),
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  const hasAnswers = question.answers.reduce((prev, cur) => prev + cur.totalVotes, 0) > 0;
  return (
    <Card className={classes.root}>
      <CardHeader title={question.title} />
      <CardContent className={classes.content}>
        <div className={classes.dataContainer}>
          <Typography className={classes.description}>{question.description}</Typography>
          {hasAnswers > 0 ? (
            <div>
              <Doughnut data={data} />
            </div>
          ) : null}
        </div>
        {canVote ? <Vote question={question} onVoted={onVoted} /> : null}
      </CardContent>
    </Card>
  );
});
