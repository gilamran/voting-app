import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { getMyAccount } from '../orbs-gateway/my-account';
import { Card, CardHeader, Typography, CardContent, Button } from '@material-ui/core';
import {
  uploadVotingContract,
  isOwner,
  getOwner,
  getQuestion,
  getNumberOfQuestions,
  addBoolQuestion,
} from '../orbs-gateway/deployment';
import { uint8ArrayToHexString } from '../orbs-gateway/utils';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing.unit * 3,
      marginBottom: theme.spacing.unit * 3,
    },
  });

interface IProps extends WithStyles<typeof styles> {}

const myAccount = getMyAccount();

export const AccountInfo = withStyles(styles)(({ classes }: IProps) => (
  <Card className={classes.root}>
    <CardHeader title='Account Info' />
    <CardContent>
      <Typography>Public Key: {uint8ArrayToHexString(myAccount.publicKey)}</Typography>
      <Typography>Address: {myAccount.address}</Typography>
      <Button onClick={() => uploadVotingContract()}>Upload Voting contract</Button>
      <Button onClick={() => isOwner()}>Is Owner</Button>
      <Button onClick={() => addBoolQuestion({ title: 'bool title', description: 'bool desc' })}>
        Add Bool Question
      </Button>
    </CardContent>
  </Card>
));
