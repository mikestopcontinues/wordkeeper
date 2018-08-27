// import

import React, {Component} from 'react';
import {connect} from 'react-redux';
import pt from 'prop-types';
import _ from 'lodash';
import cn from 'classnames';
import {Form, Text, Select, Option} from 'informed';

import {history} from '../store';
import {sessionActions} from '../SessionStore/SessionStore';
import Icon from '../Icon/Icon';

import styles from './ActiveForm.css';

// component

export class ActiveForm extends Component {
  static propTypes = {
    activeSession: pt.object,
    locations: pt.array,
    previousSession: pt.object,
    projects: pt.array,
    revisions: pt.array,
  };

  static defaultProps = {
    activeSession: null,
    locations: [],
    previousSession: null,
    projects: [],
    revisions: [],
  };

  constructor() {
    super();
    sessionActions.getSessions();
  }

  _getFormApi(api) {
    this.formApi = api;
  }

  _validateWords(val) {
    const {activeSession} = this.props;

    if (activeSession && _.isNil(val)) {
      return 'Cannot end session without word count.';
    }
  }

  _onSubmit(session) {
    const {activeSession} = this.props;

    if (activeSession) {
      session = {...activeSession, ...session};
      sessionActions.saveActiveSession(session, true);
      this.formApi.reset();
    } else {
      sessionActions.openActiveSession(session);
      history.push('/active');
    }
  }

  _reset() {
    sessionActions.exitActiveSession();
    this.formApi.reset();
  }

  render() {
    const {previousSession, activeSession, revisions, locations, projects} = this.props;

    if (!previousSession) {
      return null;
    }

    return (
      <Form className={styles.form} getApi={this::this._getFormApi} initialValues={_.pick(previousSession, ['project', 'revision', 'location'])} onSubmit={this::this._onSubmit}>
        {({formApi}) => (
          <div className={styles.bounded}>
            <button className={cn(styles.button, !activeSession && styles.green)} disabled={activeSession} type="submit">
              <Icon icon="play"/>
            </button>

            <Select className={styles.input} field="project">
              {projects.map((proj, i) => (
                <Option key={i} value={proj.key}>{proj.name}</Option>
              ))}
            </Select>

            <Select className={styles.input} field="location">
              {locations.map((loc, i) => (
                <Option key={i} value={loc.key}>{loc.name}</Option>
              ))}
            </Select>

            <Select className={styles.input} field="revision">
              {revisions.map((rev, i) => (
                <Option key={i} value={rev.key}>{rev.name}</Option>
              ))}
            </Select>

            <Text
              className={cn(
                styles.input,
                formApi.getError('words') && styles.error,
              )}
              field="words"
              type="number"
              validate={this::this._validateWords}
            />

            <button className={cn(styles.button, activeSession && styles.blue)} disabled={!activeSession} onClick={this::this._reset} type="reset">
              <Icon icon="times"/>
            </button>

            <button className={cn(styles.button, activeSession && styles.red)} disabled={!activeSession} type="submit">
              <Icon icon="stop"/>
            </button>
          </div>
        )}
      </Form>
    );
  }
}

export default connect((state) => {
  return {
    activeSession: state.session.active,
    previousSession: state.session.sessions.slice(-1).pop(),
    revisions: state.session.revisions,
    locations: state.session.locations,
    projects: state.session.projects,
  };
})(ActiveForm);
