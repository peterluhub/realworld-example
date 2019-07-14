import agent from '../agent';
import * as userHandler from './userHandler';
import * as dh from './datahandler';
import {set} from 'xsm';

  let inProgress = false;
  let errors = undefined;

  let values = {
    username: '',
    email: '',
    password: '',
  };

  export function setUsername(username) {
    values.username = username;
    set('currentUser', values);
  }

  export function setEmail(email) {
    values.email = email;
    set('currentUser', values);
  }

  export function setPassword(password) {
    values.password = password;
    set('currentUser', values);
  }

  export function reset() {
    values.username = '';
    values.email = '';
    values.password = '';
    set('currentUser', values);
  }

  export function login() {
    inProgress = true;
    errors = undefined;
    return agent.Auth.login(values.email, values.password)
      .then(({ user }) => {
        dh.setToken(user.token)
        set('currentUser', user)
      })
      .then(() => userHandler.pullUser())
      .catch((err) => {
        errors = err.response && err.response.body && err.response.body.errors;
        set('lerrors', errors);
        throw err;
      })
      .finally(() => { inProgress = false; });
  }

  export function register() {
    inProgress = true;
    errors = undefined;
    return agent.Auth.register(values.username, values.email, values.password)
      .then(({ user }) => {
        dh.setToken(user.token)
        set('currentUser', user)
      })
      .then(() => userHandler.pullUser())
      .catch((err) => {
        errors = err.response && err.response.body && err.response.body.errors;
        set('rerrors', errors);
        throw err;
      })
      .finally(() => { inProgress = false; });
  }

  export function logout() {
    dh.setToken(undefined);
    userHandler.forgetUser();
    return Promise.resolve();
  }


