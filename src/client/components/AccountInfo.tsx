import { Card, CardContent, CardHeader, Typography } from '@material-ui/core';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { getMyAccount } from '../orbs-gateway/my-account';
import { uint8ArrayToHexString } from '../orbs-gateway/utils';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: '#f3f3f3',
    },
    field: {
      display: 'inline-block',
      minWidth: 100,
      paddingBottom: 6,
    },
  });

interface IProps extends WithStyles<typeof styles> {}

const myAccount = getMyAccount();

export const AccountInfo = withStyles(styles)(({ classes }: IProps) => (
  <Card className={classes.root}>
    <CardHeader title='Account Info' />
    <CardContent>
      <Typography>
        <div className={classes.field}>
          <strong>Public Key:</strong>
        </div>
        {uint8ArrayToHexString(myAccount.publicKey)}
      </Typography>
      <Typography>
        <div className={classes.field}>
          <strong>Address:</strong>
        </div>
        {myAccount.address}
      </Typography>
    </CardContent>
  </Card>
));
