// import

import _ from 'lodash';
import {createStore, applyMiddleware, compose, combineReducers} from 'redux';
import {connectRouter, routerMiddleware} from 'connected-react-router';
import createHistory from 'history/createBrowserHistory';
import reduxPromise from 'redux-promise';
import {createLogger} from 'redux-logger';

import {sessionReducer} from './SessionStore/SessionStore';

// vars

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export const history = createHistory();

const initialState = {};

const reducers = {
  session: sessionReducer,
};

const middleware = [
  reduxPromise,
  routerMiddleware(history),
  createLogger({
    level: 'info',
    collapsed: true,
  }),
];

const enhancers = [];

// config

if (isDev) {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

  if (_.isFunction(devToolsExtension)) {
    enhancers.push(devToolsExtension());
  }
}

// export

const store = createStore(
  connectRouter(history)(combineReducers(reducers)),
  initialState,
  compose(applyMiddleware(...middleware), ...enhancers)
);

export default store;
