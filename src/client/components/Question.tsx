import { Card, CardContent, CardHeader, Typography } from '@material-ui/core';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { IQuestion } from '../types/IQuestion';
import { Vote } from './Vote';
import { Doughnut } from 'react-chartjs-2';

const styles = (theme: Theme) =>
  createStyles({
    root: {},
    dataContainer: {
      display: 'flex',
    },
    description: {
      flex: 1,
    },
  });

interface IProps extends WithStyles<typeof styles> {
  question: IQuestion;
  onVoted(answerIdx: number): void;
}

export const Question = withStyles(styles)(({ classes, question, onVoted }: IProps) => {
  if (question.answers.length === 0) {
    return null;
  }

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

  return (
    <Card className={classes.root}>
      <CardHeader title={question.title} />
      <CardContent>
        <div className={classes.dataContainer}>
          <Typography className={classes.description}>{question.description}</Typography>
          <div>
            <Doughnut data={data} />
          </div>
        </div>
        <Vote question={question} onVoted={onVoted} />
      </CardContent>
    </Card>
  );
});
