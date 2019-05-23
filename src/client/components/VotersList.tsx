import { Grid, Typography } from '@material-ui/core';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { IVoter } from '../types/IVoter';
import { AddVoter } from './AddVoter';

const styles = (theme: Theme) =>
  createStyles({
    root: {},
  });

interface IProps extends WithStyles<typeof styles> {
  canAddVoter: boolean;
  onNewVoter(voter: IVoter): void;
}

export const VotersList = withStyles(styles)(
  class extends React.Component<IProps> {
    public render() {
      const { classes, onNewVoter, canAddVoter } = this.props;
      return (
        <div className={classes.root}>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <Typography variant={'h4'}>Voters</Typography>
            </Grid>
            {canAddVoter ? (
              <Grid item xs={12}>
                <AddVoter onNewVoter={onNewVoter} />
              </Grid>
            ) : null}
          </Grid>
        </div>
      );
    }
  },
);
