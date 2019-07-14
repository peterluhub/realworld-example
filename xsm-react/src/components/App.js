import Header from './Header';
import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { appLoaded, setAppLoaded, token} from '../stateHandlers/datahandler';
import { pullUser } from '../stateHandlers/userHandler';

import Article from './Article';
import Editor from './Editor';
import Home from './Home';
import Login from './Login';
import Profile from './Profile';
import Register from './Register';
import Settings from './Settings';
import { bindState } from 'xsm';

export default @withRouter class App extends React.Component {

  constructor(props) {
    super(props)
    bindState(this)
  }

  componentWillMount() {
    if (!token) {
      setAppLoaded();
    }
  }

  componentDidMount() {
    if (token) {
      pullUser()
      .finally(() => setAppLoaded());
    }
  }

  render() {
            //<PrivateRoute path="/settings" component={Settings} />
    if (appLoaded) {
      return (
        <div>
          <Header />
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/editor/:slug?" component={Editor} />
            <Route path="/article/:id" component={Article} />
            <Route path="/settings" component={Settings} />
            <Route path="/@:username" component={Profile} />
            <Route path="/@:username/favorites" component={Profile} />
            <Route path="/" component={Home} />
          </Switch>
        </div>
      );
    }
    return (
      <Header />
    );
  }
}
