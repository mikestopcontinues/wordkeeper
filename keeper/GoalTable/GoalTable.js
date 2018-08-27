// import

import React, {Component} from 'react';
import pt from 'prop-types';
import cn from 'classnames';

import toCommas from '../../common/toCommas';

import styles from './GoalTable.css';

// component

export default class GoalTable extends Component {
  static propTypes = {
    className: pt.any,
    rows: pt.array,
  };

  static defaultProps = {
    rows: [],
  };

  _slashRenderer() {
    return (
      <span>/</span>
    );
  }

  render() {
    const {className, rows} = this.props;

    return (
      <table className={cn(styles.GoalTable, className)}>
        {rows.map(({group, words, target}, i) => (
          <tr key={i}>
            <th className={styles.group}>{group}</th>
            <td className={styles.count}>
              <span className={styles.number}>{toCommas(words)}</span>
              <span className={styles.unit}>w</span>
            </td>
            <td className={styles.slash}>/</td>
            <td className={styles.count}>
              <span className={styles.number}>{toCommas(target)}</span>
              <span className={styles.unit}>w</span>
            </td>
          </tr>
        ))}
      </table>
    );
  }
}
