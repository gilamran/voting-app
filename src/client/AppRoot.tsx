import { common } from '@material-ui/core/colors';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  createMuiTheme,
  createStyles,
  MuiThemeProvider,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { Background } from './components/Background';
import { Header } from './components/Header';

const prismVersion = (window as any).prismVersion;

const baseTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: { main: 'rgba(16, 34, 91, 0.7)' },
    secondary: { main: '#7ccbf4' },
    background: {
      default: '#16317d',
      paper: 'rgba(0, 31, 107, 0.6)',
    },
  },
  typography: {
    fontFamily: 'Montserrat',
  },
  overrides: {
    MuiTableCell: {
      body: {
        borderColor: fade(common.white, 0.15),
      },
    },
  },
});

const styles = (theme: Theme) =>
  createStyles({
    appContainer: {
      margin: 'auto',
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
      position: 'relative',
      maxWidth: 1100,
    },
  });

interface IProps extends WithStyles<typeof styles> {}

export const AppRoot = withStyles(styles)(({ classes }: IProps) => (
  <BrowserRouter>
    <MuiThemeProvider theme={baseTheme}>
      <CssBaseline />
      <Background prismVersion={prismVersion} />
      <Header />
      <div className={classes.appContainer}>
        <App />
      </div>
    </MuiThemeProvider>
  </BrowserRouter>
));
