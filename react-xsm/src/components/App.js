import Header from './Header';
import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import Article from './Article';
import Editor from './Editor';
import Home from './Home';
import Login from './Login';
import Profile from './Profile';
import Register from './Register';
import Settings from './Settings';
import {get, bindState} from 'xsm';
import {dataHandler, userHandler} from 'rw-xsm-handlers';

const {pullUser} = userHandler;
const {setAppLoaded} = dataHandler;

export default @withRouter class App extends React.Component {

  constructor(props) {
    super(props)
    bindState(this)
  }

  componentWillMount() {
    if( !this.token ) {
      setAppLoaded();
    }
  }

  componentDidMount() {
    if( this.token ) {
      pullUser()
      .finally(() => setAppLoaded());
    }
  }

  render() {
            //<PrivateRoute path="/settings" component={Settings} />
    if (this.appLoaded) {
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
