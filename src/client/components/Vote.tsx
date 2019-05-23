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

const styles = (theme: Theme) =>
  createStyles({
    root: {},
  });

interface IProps extends WithStyles<typeof styles> {
  question: IQuestion;
  onVoted(answerIdx: number): void;
}

interface IState {
  isOpen: boolean;
}

export const Vote = withStyles(styles)(
  class extends React.Component<IProps, IState> {
    constructor(props: IProps) {
      super(props);
      this.state = { isOpen: false };
    }

    public render() {
      const { title, description } = this.props.question;
      return (
        <div>
          <Button variant='contained' onClick={() => this.handleClickOpen()} color='primary'>
            Vote!
          </Button>
          <Dialog open={this.state.isOpen} onClose={() => this.handleClose()}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
              <DialogContentText>{description}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button variant='contained' onClick={() => this.voteYes()} color='secondary'>
                Yeap
              </Button>
              <Button variant='contained' onClick={() => this.voteNo()} color='secondary'>
                Nop
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    }
    private handleClickOpen() {
      this.setState({ isOpen: true });
    }

    private handleClose() {
      this.setState({ isOpen: false });
    }

    private voteNo() {
      this.setState({ isOpen: false });
      this.props.onVoted(0);
    }

    private voteYes() {
      this.setState({ isOpen: false });
      this.props.onVoted(1);
    }
  },
);
