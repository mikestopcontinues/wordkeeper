// import

import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import pt from 'prop-types';
import _ from 'lodash';
import moment from 'moment';

import {AutoSizer, Table, column, lineColumn, SortDirection} from '../Grid/Grid';
import Icon from '../Icon/Icon';

import styles from './LogList.css';

// component

export default class LogList extends Component {
  static propTypes = {
    sessions: pt.array,
  };

  static defaultProps = {
    sessions: [],
  };

  state = {
    sessions: [],
    sortBy: 'startedAt',
    sortDirection: SortDirection.DESC,
  };

  componentDidMount() {
    this.setState({
      sessions: this._sortSessions(this.state),
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.sessions !== this.props.sessions) {
      this.setState({
        sessions: this._sortSessions(this.state),
      });
    }
  }

  _startedAtRenderer({cellData}) {
    return moment(cellData).format('MMM D, h:mma');
  }

  _actionRenderer({rowData}) {
    return (
      <Link className={styles.action} to={`/session/${rowData.id}/edit`}>
        <Icon icon="edit" />
      </Link>
    );
  }

  _sort({sortBy, sortDirection}) {
    this.setState({
      sortBy,
      sortDirection,
      sessions: this._sortSessions({sortBy, sortDirection}),
    });
  }

  _sortSessions({sortBy, sortDirection}) {
    const {sessions} = this.props;

    return _(sessions)
    .sortBy((item) => item[sortBy])
    .tap((list) => {
      if (sortDirection === SortDirection.DESC) {
        return list.reverse();
      }

      return list;
    })
    .value();
  }

  render() {
    const {sortBy, sortDirection, sessions} = this.state;

    return (
      <AutoSizer>
        {({height, width}) => (
          <Table
            height={height}
            rowClassName={styles.row}
            rows={sessions}
            sort={this::this._sort}
            sortBy={sortBy}
            sortDirection={sortDirection}
            width={width}
          >
            {column({
              cellRenderer: this._startedAtRenderer,
              dataKey: 'startedAt',
              label: 'Started',
              width: 110,
            })}

            {lineColumn()}

            {column({
              columnData: {unit: 'w'},
              dataKey: 'words',
              label: 'Words',
              width: 60,
            })}
            {column({
              columnData: {unit: 'wph'},
              dataKey: 'wordsPerHour',
              label: 'Per Hour',
              width: 80,
            })}
            {column({
              columnData: {unit: 'm'},
              dataKey: 'mins',
              label: 'Sprint',
              width: 50,
            })}

            {lineColumn()}

            {column({
              dataKey: 'project',
              label: 'Project',
              width: 100,
              type: 'text',
            })}
            {column({
              dataKey: 'revision',
              label: 'Revision',
              width: 70,
              type: 'text',
            })}
            {column({
              dataKey: 'location',
              label: 'Where',
              width: 70,
              type: 'text',
            })}

            {lineColumn()}

            {column({
              cellRenderer: this._actionRenderer,
              dataKey: 'actions',
              type: 'action',
              width: 24,
            })}
          </Table>
        )}
      </AutoSizer>
    );
  }
}
