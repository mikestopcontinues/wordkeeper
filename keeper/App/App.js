// import

import React, {Component} from 'react';
import {hot} from 'react-hot-loader';
import {Switch, Route, Redirect} from 'react-router-dom';

import AppHeader from '../AppHeader/AppHeader';
import HomeView from '../HomeView/HomeView';
import LogView from '../LogView/LogView';
import AnalysisView from '../AnalysisView/AnalysisView';
import ActiveView from '../ActiveView/ActiveView';

import styles from './App.css';

// component

export class App extends Component {
  render() {
    return (
      <div className={styles.App}>
        <AppHeader className={styles.header}/>

        <Switch>
          <Route component={LogView} path="/log"/>
          <Route component={AnalysisView} path="/analysis"/>
          <Route component={ActiveView} path="/active"/>
          {/* <Route component={HomeView} path="/"/> */}
          <Redirect path="*" to="/active"/>
        </Switch>
      </div>
    );
  }
}

export default hot(module)(App);
