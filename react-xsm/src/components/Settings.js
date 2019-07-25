import ListErrors from './ListErrors';
import React from 'react';
import { withRouter } from 'react-router-dom';
import xsm from 'xsm';
import {authHandler as ah, userHandler as uh} from 'rw-xsm-handlers';

const {bindState} = xsm;

class SettingsForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      image: '',
      username: '',
      bio: '',
      email: '',
      password: ''
    };

    bindState(this);

    this.updateState = field => ev => {
      const state = this.state;
      const newState = Object.assign({}, state, { [field]: ev.target.value });
      this.setState(newState);
    };

    this.submitForm = ev => {
      ev.preventDefault();

      const user = Object.assign({}, this.state);
      if (!user.password) {
        delete user.password;
      }

      this.props.onSubmitForm(user);
    };
  }

  componentWillMount() {
    if (this.currentUser) {
      Object.assign(this.state, {
        image: this.currentUser.image || '',
        username: this.currentUser.username,
        bio: this.currentUser.bio || '',
        email: this.currentUser.email
      });
    }
  }

  render() {
    return (
      <form onSubmit={this.submitForm}>
        <fieldset>

          <fieldset className="form-group">
            <input
              className="form-control"
              type="text"
              placeholder="URL of profile picture"
              value={this.state.image}
              onChange={this.updateState('image')}
            />
          </fieldset>

          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="text"
              placeholder="Username"
              value={this.state.username}
              onChange={this.updateState('username')}
            />
          </fieldset>

          <fieldset className="form-group">
            <textarea
              className="form-control form-control-lg"
              rows="8"
              placeholder="Short bio about you"
              value={this.state.bio}
              onChange={this.updateState('bio')}
            >
            </textarea>
          </fieldset>

          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="email"
              placeholder="Email"
              value={this.state.email}
              onChange={this.updateState('email')}
            />
          </fieldset>

          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="password"
              placeholder="New Password"
              value={this.state.password}
              onChange={this.updateState('password')}
            />
          </fieldset>

          <button
            className="btn btn-lg btn-primary pull-xs-right"
            type="submit"
            disabled={this.state.updatingUser}
          >
            Update Settings
          </button>

        </fieldset>
      </form>
    );
  }
}

@withRouter
class Settings extends React.Component {

  constructor(props) {
      super(props);
    bindState(this);
  }

  handleClickLogout = () =>
    ah.logout()
      .then(() => this.props.history.replace('/'));

  render() {
      const {updatingUserErrors, currentUser} = this;

    return (
      <div className="settings-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">

              <h1 className="text-xs-center">Your Settings</h1>

              <ListErrors errors={updatingUserErrors} />

              <SettingsForm
                currentUser={currentUser}
                onSubmitForm={user => uh.updateUser(user)} />

              <hr />

              <button
                className="btn btn-outline-danger"
                onClick={this.handleClickLogout}
              >
                Or click here to logout.
              </button>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Settings;
