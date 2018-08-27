// import

import React, {Component, Fragment} from 'react';
import cn from 'classnames';
import pt from 'prop-types';
import _ from 'lodash';

import toCommas from '../../common/toCommas';
import revisions from '../../common/revisions';

import 'react-virtualized/styles.css';
import styles from './Grid.css';

// virtualized

const vt = require('react-virtualized');

// vars

const revs = _.keyBy(revisions, 'key');

// fns

export function rowClassNameFn(className) {
  return function rowClassName({index}) {
    if (index === -1) {
      return cn(styles.headerRow, className);
    }

    return cn(styles.row, index % 2 ? styles.oddRow : styles.evenRow, className);
  };
}

export function metricCellRenderer({cellData, columnData: {unit}}) {
  return (
    <Fragment>
      <span>{toCommas(cellData)}</span>
      <span className={styles.unit}>{unit}</span>
    </Fragment>
  );
}

export function textCellRenderer({cellData}) {
  return (
    <span>{_.get(revs, `${cellData}.name`) || _.startCase(cellData)}</span>
  );
}

// components

export const {Column, AutoSizer, SortDirection} = vt;

export class Table extends Component {
  static propTypes = {
    children: pt.node,
    className: pt.any,
    rowClassName: pt.any,
    rows: pt.array,
  };

  static defaultProps = {
    rows: [],
  };

  render() {
    const {className, children, rows, ...props} = this.props;

    return (
      <vt.Table {...props}
        className={cn(styles.table, className)}
        gridClassName={styles.grid}
        headerClassName={styles.headerCell}
        headerHeight={30}
        rowClassName={rowClassNameFn(this.props.rowClassName)}
        rowCount={rows.length}
        rowGetter={({index}) => _.get(rows, index)}
        rowHeight={30}
      >
        {children}
      </vt.Table>
    );
  }
}

export function column(customProps) {
  const {className, type, cellRenderer, columnData, flexGrow, flexShrink, flexer, ...props} = customProps;
  const unit = columnData && columnData.unit;

  let thisRenderer = cellRenderer;

  if (!thisRenderer && unit) {
    thisRenderer = metricCellRenderer;
  }

  if (!thisRenderer && type === 'text') {
    thisRenderer = textCellRenderer;
  }

  return (
    <Column {...props}
      cellRenderer={thisRenderer}
      className={cn(
        styles.cell,
        type === 'metric' && styles.metricCell,
        type === 'text' && styles.textCell,
        type === 'action' && styles.actionCell,
        className,
      )}
      columnData={columnData}
      flexGrow={flexGrow || (type === 'text' || flexer ? 1 : 0)}
      flexShrink={flexShrink || (type === 'text' || flexer ? 1 : 0)}
    />
  );
}

export function lineColumn(props) {
  return column({
    cellRenderer: _.noop,
    className: styles.lineCell,
    dataKey: '$',
    disableSort: true,
    flexGrow: 0,
    flexShrink: 0,
    headerClassName: styles.lineCell,
    width: 0,
    ...props,
  });
}
