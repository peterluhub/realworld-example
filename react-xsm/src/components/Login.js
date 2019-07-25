import { withRouter, Link } from 'react-router-dom';
import ListErrors from './ListErrors';
import React from 'react';
import xsm from 'xsm';
import {authHandler} from 'rw-xsm-handlers';

const {bindState} = xsm;
const { login, reset, setPassword, setEmail } = authHandler;

@withRouter
export default class Login extends React.Component {
    constructor(props) {
        super(props);
        bindState(this);
    }

  componentWillUnmount() {
    //reset();
  }

  handleEmailChange = e => setEmail(e.target.value);
  handlePasswordChange = e => setPassword(e.target.value);
  handleSubmitForm = (e) => {
    e.preventDefault();
    login()
      .then(() => this.props.history.replace('/'));
  };

  render() {
    let { currentUser, lerrors, linProgress } = this
    if( !currentUser )
        currentUser = {username: '', email: '', password: ''};
    
    if( !currentUser.email ) 
        currentUser.email = '';
    if( !currentUser.password ) 
        currentUser.password = '';
    if( !currentUser.username ) 
        currentUser.username = '';

    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">

            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign In</h1>
              <p className="text-xs-center">
                <Link to="register">
                  Need an account?
                </Link>
              </p>

              <ListErrors errors={lerrors} />

              <form onSubmit={this.handleSubmitForm}>
                <fieldset>

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
                    disabled={linProgress}
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
