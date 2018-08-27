// import

import React, {Component} from 'react';
import cn from 'classnames';

import ActiveForm from '../ActiveForm/ActiveForm';

import styles from './AppFooter.css';

// component

export default class AppFooter extends Component {
  render() {
    return (
      <footer className={cn(styles.AppFooter)}>
        <ActiveForm/>
      </footer>
    );
  }
}
