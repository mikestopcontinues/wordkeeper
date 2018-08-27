// import

import React, {Component} from 'react';
import cn from 'classnames';

import styles from './AppContent.css';

// component

export default class AppContent extends Component {
  render() {
    const {className, children, ...props} = this.props;

    return (
      <section {...props} className={cn(styles.AppContent, className)}>
        {children}
      </section>
    );
  }
}
