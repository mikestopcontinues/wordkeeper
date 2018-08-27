// import

import React, {Component} from 'react';
import pt from 'prop-types';
import cn from 'classnames';
import Progress from 'react-circular-progressbar';
import {connect} from 'react-redux';

import styleVars from '../../common/styleVars';
import GoalTable from '../GoalTable/GoalTable';
import calcProgress from '../../common/calcProgress';

import styles from './GoalProgress.css';

// component

export class GoalProgress extends Component {
  static propTypes = {
    className: pt.any,
    sessions: pt.array,
  };

  static defaultProps = {
    sessions: [],
  };

  state = {
    rows: [],
  };

  componentDidMount() {
    this.setState({
      rows: this._groupSessions(),
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.sessions === prevProps.sessions && this.state.rows !== prevState.rows) {
      return;
    }

    this.setState({
      rows: this._groupSessions(),
    });
  }

  _groupSessions() {
    return calcProgress(this.props.sessions);
  }

  render() {
    const {className} = this.props;
    const {rows} = this.state;

    if (!rows.length) {
      return null;
    }

    return (
      <div className={cn(styles.GoalProgress, className)}>
        <Progress
          className={styles.yearly}
          percentage={rows[3].percentage}
          strokeWidth={3}
          styles={{path: {
            stroke: styleVars.blue5,
            strokeLinecap: 'round',
          }}}
        />
        <Progress
          className={styles.monthly}
          percentage={rows[2].percentage}
          strokeWidth={3}
          styles={{path: {
            stroke: styleVars.blue4,
            strokeLinecap: 'round',
          }}}
        />
        <Progress
          className={styles.weekly}
          percentage={rows[1].percentage}
          strokeWidth={3}
          styles={{path: {
            stroke: styleVars.blue3,
            strokeLinecap: 'round',
          }}}
        />
        <Progress
          className={styles.daily}
          percentage={rows[0].percentage}
          strokeWidth={3}
          styles={{path: {
            stroke: styleVars.blue2,
            strokeLinecap: 'round',
          }}}
        />

        <div className={styles.table}>
          <GoalTable className={styles.grid} rows={rows}/>
        </div>
      </div>
    );
  }
}

export default connect((state) => {
  return {
    sessions: state.session.sessions,
  };
})(GoalProgress);
