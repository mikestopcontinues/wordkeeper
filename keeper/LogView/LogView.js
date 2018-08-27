// import

import React, {Component} from 'react';
import {connect} from 'react-redux';
import pt from 'prop-types';

import {sessionActions} from '../SessionStore/SessionStore';

import AppContent from '../AppContent/AppContent';
import LogList from '../LogList/LogList';

import styles from './LogView.css';

// component

export class LogView extends Component {
  static propTypes = {
    sessions: pt.array,
  };

  static defaultProps = {
    sessions: [],
  };

  constructor() {
    super();
    sessionActions.getSessions();
  }

  render() {
    const {sessions} = this.props;

    return (
      <AppContent className={styles.LogView}>
        <LogList sessions={sessions}/>
      </AppContent>
    );
  }
}

export default connect((state) => {
  return {
    sessions: state.session.sessions,
  };
})(LogView);
