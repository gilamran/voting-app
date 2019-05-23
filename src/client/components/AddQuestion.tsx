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
  onNewQuestion(question: IQuestion): void;
}

interface IState {
  isOpen: boolean;
  question: IQuestion;
}

export const AddQuestion = withStyles(styles)(
  class extends React.Component<IProps, IState> {
    constructor(props: IProps) {
      super(props);
      this.state = { isOpen: false, question: { title: '', description: '' } };
    }

    public render() {
      return (
        <div>
          <Fab variant='extended' color='secondary' onClick={() => this.handleClickOpen()}>
            Add Question
          </Fab>
          <Dialog open={this.state.isOpen} onClose={() => this.handleClose()} aria-labelledby='form-dialog-title'>
            <DialogTitle>Ask a question</DialogTitle>
            <DialogContent>
              <DialogContentText>Please provide a title, and a detailed description.</DialogContentText>
              <TextField
                value={this.state.question.title}
                onChange={e => this.setTitle(e.currentTarget.value)}
                margin='dense'
                id='title'
                label='Title'
                fullWidth
              />
              <TextField
                value={this.state.question.description}
                onChange={e => this.setDescription(e.currentTarget.value)}
                margin='dense'
                id='desc'
                label='Description'
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.handleClose()} color='secondary'>
                Cancel
              </Button>
              <Button variant='contained' onClick={() => this.handleSubmit()} color='secondary'>
                Ask!
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    }

    private setTitle(title: string) {
      this.setState({ question: { title, description: this.state.question.description } });
    }

    private setDescription(description: string) {
      this.setState({ question: { description, title: this.state.question.title } });
    }

    private handleClickOpen() {
      this.setState({ isOpen: true });
    }

    private handleClose() {
      this.setState({ isOpen: false });
    }

    private handleSubmit() {
      this.setState({ isOpen: false, question: { title: '', description: '' } });
      this.props.onNewQuestion(this.state.question);
    }
  },
);
