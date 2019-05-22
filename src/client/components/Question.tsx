import { Card, CardContent, CardHeader, Grid, Typography } from '@material-ui/core';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { IQuestion } from '../types/IQuestion';

const styles = (theme: Theme) =>
  createStyles({
    root: {},
  });

interface IProps extends WithStyles<typeof styles> {
  question: IQuestion;
}

export const Question = withStyles(styles)(({ classes, question }: IProps) => (
  <Card className={classes.root}>
    <CardHeader title={question.title} />
    <CardContent>
      <Typography>{question.description}</Typography>
    </CardContent>
  </Card>
));
