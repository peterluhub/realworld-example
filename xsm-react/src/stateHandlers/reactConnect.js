import React from 'react';

const connect = (Component) => {
  return class Connect extends React.Component {
    constructor(props) {
      super(props);

    }
    componentWillUnmount() {
    }
    render() {
      return <Component {...this.props} {...this.state} />;
    }
  };
};

export default () => {
  return connect
};