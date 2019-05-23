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
import { Home } from './components/Home';
import { Background } from './components/Background';
import { Header } from './components/Header';
import { AccountInfo } from './components/AccountInfo';

const appVersion = (window as any).appVersion;

const baseTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: { main: '#ffeb3b' },
    secondary: { main: '#651fff' },
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
      maxWidth: 2000,
    },
  });

interface IProps extends WithStyles<typeof styles> {}

export const AppRoot = withStyles(styles)(({ classes }: IProps) => (
  <BrowserRouter>
    <MuiThemeProvider theme={baseTheme}>
      <CssBaseline />
      <Background appVersion={appVersion} />
      <Header />
      <div className={classes.appContainer}>
        <Home />
      </div>
    </MuiThemeProvider>
  </BrowserRouter>
));
