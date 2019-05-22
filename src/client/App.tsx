import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { withRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { Home } from './components/Home';
import { Voater } from './components/Voater';

const styles = (theme: Theme) =>
  createStyles({
    swipeContainer: {
      position: 'absolute',
      width: '100%',
    },
  });

interface IProps extends WithStyles<typeof styles> {
  location?: any;
}

export const AppImpl = withStyles(styles)(({ classes, location }: IProps) => (
  <Switch location={location}>
    <Route exact path='/' render={() => <Home />} />
    <Route path='/voater' render={({ match }) => <Voater />} />
  </Switch>
));

export const App: any = withRouter(AppImpl);
