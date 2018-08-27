// import

import React, {Component} from 'react';
import pt from 'prop-types';
import _ from 'lodash';

import {AutoSizer, Table, column, lineColumn, SortDirection} from '../Grid/Grid';

import styles from './GroupByTable.css';

// component

export default class GroupByTable extends Component {
  static propTypes = {
    cols: pt.arrayOf(pt.string),
    defaultSortDirection: pt.string,
    label: pt.string,
    rows: pt.arrayOf(pt.object),
  };

  static defaultProps = {
    cols: [
      'words',
      'wordsPerHour',
      'wordsPerDay',
      'mins',
    ],
    rows: [],
  };

  state = {
    sortBy: 'group',
    sortDirection: SortDirection.ASC,
    rows: [],
  };

  componentDidMount() {
    const {defaultSortDirection} = this.props;

    this.setState({
      sortDirection: defaultSortDirection || this.state.sortDirection,
      rows: this._sortRows(this.state),
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.rows === prevProps.rows && this.state.rows !== prevState.rows) {
      return;
    }

    this.setState({
      rows: this._sortRows(this.state),
    });
  }

  _sort({sortBy, sortDirection}) {
    this.setState({
      sortBy,
      sortDirection,
      rows: this._sortRows({sortBy, sortDirection}),
    });
  }

  _sortRows({sortBy, sortDirection}) {
    const {rows} = this.props;

    if (sortBy === 'group') {
      if (sortDirection === SortDirection.DESC) {
        return rows.slice().reverse();
      }

      return rows.slice();
    }

    return _(rows)
    .sortBy((item) => item[sortBy])
    .thru((list) => {
      if (sortDirection === SortDirection.DESC) {
        return list.reverse();
      }

      return list;
    })
    .value();
  }

  render() {
    const {label, cols, ...props} = this.props;
    const {sortBy, sortDirection, rows} = this.state;
    const exists = _.keyBy(cols);

    const prefixed = {};

    function prefixFirst(prefix, suffix = '') {
      if (!prefixed[prefix]) {
        prefixed[prefix] = true;
        return `${prefix}${suffix}`;
      }

      return suffix;
    }

    return (
      <AutoSizer className={styles.groupByTable} disableHeight>
        {({width}) => (
          <Table {...props}
            height={30 * (rows.length + 1)}
            rows={rows}
            sort={this::this._sort}
            sortBy={sortBy}
            sortDirection={sortDirection}
            width={width}
          >
            {column({
              label,
              dataKey: 'group',
              width: 110,
            })}

            {cols.some((c) => c.startsWith('words')) && lineColumn()}

            {exists.words && column({
              columnData: {unit: 'w'},
              dataKey: 'words',
              label: prefixFirst('Words'),
              width: 50,
              flexer: true,
            })}
            {exists.wordsPerHour && column({
              columnData: {unit: 'wph'},
              dataKey: 'wordsPerHour',
              label: prefixFirst('Words', '/Hour'),
              width: 50,
              flexer: true,
            })}
            {exists.wordsPerDay && column({
              columnData: {unit: 'wpd'},
              dataKey: 'wordsPerDay',
              label: prefixFirst('Words', '/Day'),
              width: 50,
              flexer: true,
            })}
            {exists.wordsPerSprint && column({
              columnData: {unit: 'wps'},
              dataKey: 'wordsPerSprint',
              label: prefixFirst('Words', '/Sprint'),
              width: 50,
              flexer: true,
            })}

            {cols.some((c) => c.startsWith('mins')) && lineColumn()}

            {exists.mins && column({
              columnData: {unit: 'm'},
              dataKey: 'mins',
              label: prefixFirst('Mins'),
              width: 50,
              flexer: true,
            })}
            {exists.minsPerDay && column({
              columnData: {unit: 'mps'},
              dataKey: 'minsPerDay',
              label: prefixFirst('Mins', '/Day'),
              width: 50,
              flexer: true,
            })}
            {exists.minsPerSprint && column({
              columnData: {unit: 'mps'},
              dataKey: 'minsPerSprint',
              label: prefixFirst('Mins', '/Sprint'),
              width: 50,
              flexer: true,
            })}

            {cols.some((c) => c.startsWith('sprints')) && lineColumn()}

            {exists.sprints && column({
              columnData: {unit: 's'},
              dataKey: 'sprints',
              label: prefixFirst('Sprints'),
              width: 50,
              flexer: true,
            })}
            {exists.sprintsPerDay && column({
              columnData: {unit: 'spd'},
              dataKey: 'sprintsPerDay',
              label: prefixFirst('Sprints', '/Day'),
              width: 50,
              flexer: true,
            })}
          </Table>
        )}
      </AutoSizer>
    );
  }
}
