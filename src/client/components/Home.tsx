import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';

const styles = (theme: Theme) =>
  createStyles({
    root: {},
  });

interface IProps extends WithStyles<typeof styles> {}

export const Home = withStyles(styles)(({ classes }: IProps) => <div className={classes.root}>This is Home</div>);
