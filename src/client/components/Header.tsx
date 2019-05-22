import AppBar from '@material-ui/core/AppBar';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { withRouter } from 'react-router';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    title: {
      flexGrow: 1,
      textAlign: 'center',
    },
    cleanLink: {
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    logo: {
      height: 30,
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing.unit,
        width: 'auto',
      },
    },
    searchIcon: {
      width: theme.spacing.unit * 5,
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
      fontSize: 12,
      width: '100%',
    },
    inputInput: {
      paddingTop: theme.spacing.unit,
      paddingRight: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
      paddingLeft: theme.spacing.unit * 5,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: 200,
        '&:focus': {
          width: 350,
        },
      },
    },
  });

interface IProps extends WithStyles<typeof styles> {
  history: any;
}

const HeaderImpl = withStyles(styles)(
  class extends React.Component<IProps> {
    public render() {
      const { classes } = this.props;
      return (
        <div className={classes.root}>
          <AppBar position='static'>
            <Toolbar>
              <div className={classes.title}>
                <Typography variant='h5'>Voating App</Typography>
              </div>
            </Toolbar>
          </AppBar>
        </div>
      );
    }
  },
);

export const Header: any = withRouter(withStyles(styles)(HeaderImpl));
