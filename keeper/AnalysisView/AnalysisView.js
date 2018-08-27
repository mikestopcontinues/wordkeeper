// import

import React, {Component} from 'react';
import {connect} from 'react-redux';
import pt from 'prop-types';

import {sessionActions} from '../SessionStore/SessionStore';

import AppContent from '../AppContent/AppContent';
import GroupByWidget from '../GroupByWidget/GroupByWidget';
import groupBy from '../../common/groupBy';

import styles from './AnalysisView.css';

// component

export class AnalysisView extends Component {
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
      <AppContent className={styles.AnalysisView}>
        <GroupByWidget {...groupBy.day} clipBy={7} sessions={sessions}/>
        <GroupByWidget {...groupBy.week} clipBy={7} sessions={sessions}/>
        <GroupByWidget {...groupBy.month} clipBy={7} sessions={sessions}/>
        <GroupByWidget {...groupBy.hoursOfDay} clipBy={7} sessions={sessions}/>
        <GroupByWidget {...groupBy.daysOfWeek} clipBy={7} sessions={sessions}/>
        <GroupByWidget {...groupBy.minsPerSprint} sessions={sessions}/>
        <GroupByWidget {...groupBy.concentricEpochs} sessions={sessions}/>
      </AppContent>
    );
  }
}

export default connect((state) => {
  return {
    sessions: state.session.sessions,
  };
})(AnalysisView);
