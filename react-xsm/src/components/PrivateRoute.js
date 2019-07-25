import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import xsm from 'xsm';

const {bindState} = xsm;


//@inject('userStore', 'commonStore')
export default class PrivateRoute extends React.Component {
  constructor(props) {
    super(props)
    bindState(this)
  }
  render() {
    //const { userStore, ...restProps } = this.props;
    if (this.currentUser) return <Route  />;
    //if (this.state.currentUser) return <Route {...restProps} />;
    return <Redirect to="/" />;
  }
}
