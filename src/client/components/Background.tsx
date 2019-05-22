import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { Typography } from '@material-ui/core';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
      zIndex: -1000,
      position: `absolute`,
      overflow: 'hidden',
    },
    appVersion: {
      position: `fixed`,
      bottom: 4,
      left: 4,
    },
  });

interface IProps extends WithStyles<typeof styles> {
  appVersion: string;
}

export const Background = withStyles(styles)(
  class extends React.Component<IProps> {
    public render() {
      const { classes, appVersion } = this.props;
      return (
        <div className={classes.root}>
          <Typography className={classes.appVersion} variant='caption'>
            {appVersion}
          </Typography>
        </div>
      );
    }
  },
);
