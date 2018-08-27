// import

import ipc from 'electron-better-ipc';
import moment from 'moment';
import _ from 'lodash';

import revisions from '../../common/revisions';
import ipcTypes from '../../common/ipcTypes';
import {createActions, createReducers} from '../ReduxHelper/ReduxHelper';

// state

const INITIAL_STATE = {
  sessions: [],
  active: null,
  edit: null,
  revisions,
  locations: [],
  projects: [],
};

// types & actions

export const {
  types: sessionTypes,
  actions: sessionActions,
} = createActions('session', {
  getSessions() {
    return ipc.callMain(ipcTypes.getSessions).then((sessions) => {
      return sessions.map((session) => {
        const hours = moment(session.stoppedAt)
        .diff(session.startedAt, 'h', true);

        session.wordsPerHour = Math.round(session.words / hours);
        session.mins = moment(session.stoppedAt).diff(session.startedAt, 'm');

        return session;
      });
    });
  },

  // active

  openActiveSession(session) {
    session.startedAt = moment().format();
    return session;
  },
  saveActiveSession(session, exit = false) {
    session.stoppedAt = moment().format();

    return ipc.callMain(ipcTypes.saveSession, session)
    .then(() => sessionActions.getSessions())
    .then((sessions) => {
      if (exit) {
        sessionActions.exitActiveSession();
        return;
      }

      return _.find(sessions, {id: session.id});
    });
  },
  exitActiveSession: null,

  // edit

  openEditSession: null,
  saveEditSession(session, exit = false) {
    return ipc.callMain(ipcTypes.saveSession, session)
    .then(() => sessionActions.getSessions())
    .then((sessions) => {
      if (exit) {
        sessionActions.exitEditSession();
        return;
      }

      return _.find(sessions, {id: session.id});
    });
  },
  exitEditSession: null,
});

// reducers

export const sessionReducer = createReducers(INITIAL_STATE, {
  [sessionTypes.getSessions]: (state, {payload}) => {
    state.sessions = payload;

    state.locations = _(payload)
    .groupBy('location')
    .map((arr, key) => {
      return {key, name: _.startCase(key)};
    })
    .sortBy('name')
    .value();

    state.projects = _(payload)
    .groupBy('project')
    .map((arr, key) => {
      return {key, name: _.startCase(key)};
    })
    .sortBy('name')
    .value();

    return state;
  },

  // active

  [sessionTypes.openActiveSession]: (state, {payload}) => {
    state.active = payload;
    return state;
  },
  [sessionTypes.saveActiveSession]: (state, {payload}) => {
    state.active = payload;
    return state;
  },
  [sessionTypes.exitActiveSession]: (state) => {
    state.active = null;
    return state;
  },

  // edit

  [sessionTypes.openEditSession]: (state, {payload}) => {
    state.edit = payload;
    return state;
  },
  [sessionTypes.saveEditSession]: (state, {payload}) => {
    state.edit = payload;
    return state;
  },
  [sessionTypes.exitEditSession]: (state) => {
    state.edit = null;
    return state;
  },
});
