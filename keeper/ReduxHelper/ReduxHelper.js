// import

import _ from 'lodash';
import store from '../store.js';

// export

export function createActions(namespace, actionMap) {
  const types = _.mapValues(actionMap, (actionFn, key) => {
    return _.snakeCase(`${namespace} ${key}`).toUpperCase();
  });

  const actions = _.mapValues(actionMap, (actionFn, key) => {
    return function dispatcherAction(...args) {
      const action = {
        type: types[key],
        payload: (actionFn || _.identity)(...args),
      };

      return store.dispatch(action);
    };
  });

  return {types, actions};
}

export function createReducers(initialState, handlers) {
  return function reducer(state = initialState, action) {
    const handler = handlers[action.type];
    return handler ? handler(state, action) : state;
  };
}
