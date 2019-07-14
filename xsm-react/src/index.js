/* eslint-disable import/first */
import ReactDOM from 'react-dom';
import React from 'react';
import { HashRouter } from 'react-router-dom';
import promiseFinally from 'promise.prototype.finally';

import App from './components/App';

import * as bindings from './stateHandlers/state';

import {setcfg} from 'xsm';

setcfg({
  framework: 'React',
  debug: false,
  trace: true,
  bindings
});

promiseFinally.shim();

ReactDOM.render((
    <HashRouter>
      <App />
    </HashRouter>
), document.getElementById('root'));
