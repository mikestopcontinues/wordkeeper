// import

import React, {Component} from 'react';
import pt from 'prop-types';
import _ from 'lodash';
import {sessionActions} from '../SessionStore/SessionStore';
import AppContent from '../AppContent/AppContent';
import ActiveForm from '../ActiveForm/ActiveForm';
import QuoteSpinner from '../QuoteSpinner/QuoteSpinner';
import GoalProgress from '../GoalProgress/GoalProgress';

import styles from './ActiveView.css';

// component

export default class ActiveView extends Component {
  static propTypes = {
    activeSession: pt.object,
  };

  static defaultProps = {
    activeSession: null,
  };

  constructor() {
    super();
    sessionActions.getSessions();
  }

  _getFormApi(api) {
    this.formApi = api;
  }

  _onSubmit(session) {
    const {activeSession} = this.props;

    if (activeSession) {
      session = {...activeSession, ...session};
      sessionActions.saveActiveSession(session, true);
    } else {
      sessionActions.openActiveSession(session);
    }
  }

  _validateWords(val) {
    const {activeSession} = this.props;

    if (activeSession && _.isNil(val)) {
      return 'Cannot end session without word count.';
    }
  }

  _reset() {
    sessionActions.exitActiveSession();
  }

  render() {
    return (
      <AppContent className={styles.ActiveView}>
        <div className={styles.quote}>
          <QuoteSpinner/>
        </div>

        <div className={styles.goals}>
          <GoalProgress/>
        </div>

        <div className={styles.form}>
          <ActiveForm/>
        </div>
      </AppContent>
    );
  }
}
