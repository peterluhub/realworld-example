/* eslint-disable import/first */
import ReactDOM from 'react-dom';
import React from 'react';
import { HashRouter } from 'react-router-dom';
import promiseFinally from 'promise.prototype.finally';

import xsm from 'xsm';
import {react_component2state as bindings} from 'rw-xsm-handlers';

const {setcfg} = xsm;

setcfg({
  framework: 'React',
  debug: false,
  trace: false,
  bindings
});
import App from './components/App';

promiseFinally.shim();

ReactDOM.render((
    <HashRouter>
      <App />
    </HashRouter>
), document.getElementById('root'));
