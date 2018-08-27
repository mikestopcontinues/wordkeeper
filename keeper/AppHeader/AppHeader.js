// import

import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import cn from 'classnames';

import Icon from '../Icon/Icon';

import styles from './AppHeader.css';

// vars

const menu = [
  {to: '/log', icon: 'database'},
  {to: '/analysis', icon: 'chart-line'},
  {to: '/settings', icon: 'cog'},
];

// component

export class AppHeader extends Component {
  render() {
    const {activeSession} = this.props;

    return (
      <header className={cn(styles.AppHeader, activeSession && styles.disabled)}>
        <Link className={styles.logo} to="/">
          <Icon icon="book"/> WordKeeper
        </Link>

        <nav className={styles.menu}>
          {menu.map(({to, icon}, key) => (
            <Link className={styles.menuItem} key={key} to={to}>
              <Icon icon={icon}/>
            </Link>
          ))}
        </nav>
      </header>
    );
  }
}

export default connect((state) => {
  return {
    activeSession: state.session.active,
  };
})(AppHeader);
