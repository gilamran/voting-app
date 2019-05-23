import {
  Grid,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Card,
  CardContent,
  CardHeader,
  CardActions,
} from '@material-ui/core';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { IVoter } from '../types/IVoter';
import { AddVoter } from './AddVoter';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing.unit * 3,
      marginBottom: theme.spacing.unit * 3,
    },
    table: {},
    card: {
      backgroundColor: '#f3f3f3',
    },
  });

interface IProps extends WithStyles<typeof styles> {
  canAddVoter: boolean;
  votersList: IVoter[];
  onNewVoter(voter: IVoter): void;
}

export const VotersList = withStyles(styles)(
  class extends React.Component<IProps> {
    public render() {
      const { classes, onNewVoter, canAddVoter, votersList } = this.props;
      return (
        <Grid container spacing={16} className={classes.root}>
          <Grid item xs={12}>
            <Card className={classes.card}>
              <CardHeader title='Voters' />
              <CardContent>
                {votersList.length === 0 ? null : (
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Address</TableCell>
                        <TableCell align='center'>Weight</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {votersList.map((v, voterIdx) => (
                        <TableRow key={voterIdx}>
                          <TableCell component='th' scope='row'>
                            0x{v.Address}
                          </TableCell>
                          <TableCell align='center'>{v.Weight}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
              {canAddVoter ? (
                <CardActions>
                  <AddVoter onNewVoter={onNewVoter} />
                </CardActions>
              ) : null}
            </Card>
          </Grid>
        </Grid>
      );
    }
  },
);
