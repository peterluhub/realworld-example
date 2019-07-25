import { Link } from 'react-router-dom';
import ListErrors from './ListErrors';
import React from 'react';
import xsm from 'xsm';
import {authHandler} from 'rw-xsm-handlers';

const {bindState,set} = xsm;
const { reset, setUsername, setEmail, setPassword, register } = authHandler;

export default class Register extends React.Component {

    constructor(props) {
        super(props);
        bindState(this);
    }

  componentWillUnmount() {
    reset();
  }

  handleUsernameChange = e => setUsername(e.target.value);
  handleEmailChange = e => setEmail(e.target.value);
  handlePasswordChange = e => setPassword(e.target.value);
  handleSubmitForm = (e) => {
    e.preventDefault();
    register()
      .then(() => this.props.history.replace('/'));
  };

  render() {
    let { currentUser, rerrors, rinProgress } = this;
    if( !currentUser ) 
        currentUser = {username: '', email: '', password: ''};

    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">

            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign Up</h1>
              <p className="text-xs-center">
                <Link to="login">
                  Have an account?
                </Link>
              </p>

              <ListErrors errors={rerrors} />

              <form onSubmit={this.handleSubmitForm}>
                <fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Username"
                      value={currentUser.username}
                      onChange={this.handleUsernameChange}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="email"
                      placeholder="Email"
                      value={currentUser.email}
                      onChange={this.handleEmailChange}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="password"
                      placeholder="Password"
                      value={currentUser.password}
                      onChange={this.handlePasswordChange}
                    />
                  </fieldset>

                  <button
                    className="btn btn-lg btn-primary pull-xs-right"
                    type="submit"
                    disabled={rinProgress}
                  >
                    Sign in
                  </button>

                </fieldset>
              </form>
            </div>

          </div>
        </div>
      </div>
    );
  }
}
