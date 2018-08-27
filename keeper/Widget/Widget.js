// import

import React, {Component} from 'react';
import cn from 'classnames';

import styles from './Widget.css';

// component

export default class Widget extends Component {
  render() {
    const {className, children, ...props} = this.props;

    return (
      <article {...props} className={cn(styles.Widget, className)}>
        {children}
      </article>
    );
  }
}
