// import

import React, {Component} from 'react';
import {ResponsiveLine} from '@nivo/line';
import pt from 'prop-types';
import cn from 'classnames';
import _ from 'lodash';

import styles from './GroupByBarChart.css';

// component

export default class GroupByBarChart extends Component {
  static propTypes = {
    className: pt.any,
    cols: pt.arrayOf(pt.string),
    defaultSortDirection: pt.string,
    label: pt.string,
    rows: pt.arrayOf(pt.object),
  };

  render() {
    const {className, rows} = this.props;

    const between = rows.reduce((lines, row) => {
      _.forEach(lines, (arr, key) => {
        arr.push({
          x: row.group.slice(5).replace('-', '/'),
          y: row[key],
        });
      });

      return lines;
    }, {
      words: [],
      wordsPerHour: [],
      wordsPerDay: [],
    });

    return (
      <div className={cn(styles.GroupByBarChart, className)}>
        <ResponsiveLine
          data={_.map(between, (data, id) => ({
            id: _.startCase(id).replace(' Per ', '/'),
            data,
          }))}
          legends={[{
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
            effects: [{
              on: 'hover',
              style: {
                itemBackground: 'rgba(0, 0, 0, .03)',
                itemOpacity: 1,
              },
            }],
          }]}
          margin={{
            top: 10,
            left: 40,
            right: 15,
            bottom: 25,
          }}
          minY="auto"
          stacked
        />
      </div>
    );
  }
}
