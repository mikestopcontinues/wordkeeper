// import

import React, {Component} from 'react';
import cn from 'classnames';
import pt from 'prop-types';
import _ from 'lodash';

import Widget from '../Widget/Widget';
import GroupByTable from '../GroupByTable/GroupByTable';
import GroupByBarChart from '../GroupByBarChart/GroupByBarChart';
import groupSessions from '../../common/groupSessions';
import ToggleButton from '../ToggleButton/ToggleButton';

import styles from './GroupByWidget.css';

// component

export default class GroupByWidget extends Component {
  static propTypes = {
    className: pt.string,
    clipBy: pt.oneOfType([pt.number, pt.func]),
    defaultSortDirection: pt.string,
    filterBy: pt.oneOfType([pt.number, pt.func]),
    groupBy: pt.func.isRequired,
    label: pt.string,
    sessions: pt.arrayOf(pt.object).isRequired,
    sortBy: pt.oneOfType([pt.string, pt.func]),
  };

  static defaultProps = {
    sessions: [],
  };

  state = {
    rows: [],
    showChart: false,
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
    return groupSessions(this.props.sessions, this.props);
  }

  _onToggle(value) {
    this.setState({showChart: value});
  }

  render() {
    const {className, label, defaultSortDirection, cols, ...props} = _.omit(this.props, ['clipBy', 'groupBy', 'sortBy', 'filterBy', 'sessions']);
    const {rows, showChart} = this.state;

    return (
      <Widget {...props} className={cn(styles.GroupByWidget, className)}>
        <header className={styles.header}>
          <div className={styles.title}>{label}</div>
          {/* <ToggleButton className={styles.toggle} color="green" onChange={this::this._onToggle} param="details"/> */}
        </header>

        {showChart ? (
          <GroupByBarChart rows={rows}/>
        ) : (
          <GroupByTable
            cols={cols}
            defaultSortDirection={defaultSortDirection}
            label="Group"
            rows={rows}
          />
        )}
      </Widget>
    );
  }
}
