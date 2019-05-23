import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import * as React from 'react';
import { IQuestion } from '../types/IQuestion';
import { Fab } from '@material-ui/core';
import { IVoter } from '../types';

const styles = (theme: Theme) =>
  createStyles({
    root: {},
  });

interface IProps extends WithStyles<typeof styles> {
  onNewVoter(voter: IVoter): void;
}

interface IState {
  isOpen: boolean;
  voter: IVoter;
}

export const AddVoter = withStyles(styles)(
  class extends React.Component<IProps, IState> {
    constructor(props: IProps) {
      super(props);
      this.state = { isOpen: false, voter: { address: '', weight: 0 } };
    }

    public render() {
      return (
        <div>
          <Fab variant='extended' color='secondary' onClick={() => this.handleClickOpen()}>
            Add Voter
          </Fab>
          <Dialog open={this.state.isOpen} onClose={() => this.handleClose()}>
            <DialogTitle>Add voter</DialogTitle>
            <DialogContent>
              <DialogContentText>Please provider a voter address and a weight.</DialogContentText>
              <TextField
                value={this.state.voter.address}
                onChange={e => this.setAddress(e.currentTarget.value)}
                margin='dense'
                id='address'
                label='Address'
                fullWidth
              />
              <TextField
                value={this.state.voter.weight}
                onChange={e => this.setWeight(parseInt(e.currentTarget.value, 10))}
                margin='dense'
                id='weight'
                label='Weight'
                type='number'
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.handleClose()} color='secondary'>
                Cancel
              </Button>
              <Button variant='contained' onClick={() => this.handleSubmit()} color='secondary'>
                Add!
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    }

    private setAddress(address: string) {
      this.setState({ voter: { address, weight: this.state.voter.weight } });
    }

    private setWeight(weight: number) {
      this.setState({ voter: { weight, address: this.state.voter.address } });
    }

    private handleClickOpen() {
      this.setState({ isOpen: true });
    }

    private handleClose() {
      this.setState({ isOpen: false });
    }

    private handleSubmit() {
      this.setState({ isOpen: false });
      this.props.onNewVoter(this.state.voter);
    }
  },
);
