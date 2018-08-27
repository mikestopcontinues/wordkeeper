// import

import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import pt from 'prop-types';
import _ from 'lodash';
import cn from 'classnames';
import {Form, Text, Select, Option} from 'informed';

import {sessionActions} from '../SessionStore/SessionStore';
import Widget from '../Widget/Widget';
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

  _onSubmit(session) {
    const {activeSession} = this.props;

    if (activeSession) {
      session = {...activeSession, ...session};
      sessionActions.saveActiveSession(session, true);
    } else {
      sessionActions.openActiveSession(session);
    }
  }

  _validateWords(val) {
    const {activeSession} = this.props;

    if (activeSession && _.isNil(val)) {
      return 'Cannot end session without word count.';
    }
  }

  _reset() {
    sessionActions.exitActiveSession();
  }

  render() {
    const {previousSession, activeSession, revisions, locations, projects} = this.props;

    if (!previousSession) {
      return null;
    }

    return (
      <Form className={styles.form} initialValues={_.pick(previousSession, ['project', 'revision', 'location'])} onSubmit={this::this._onSubmit}>
        {({formApi}) => (
          <Fragment>
            <div className={styles.row}>
              <div className={styles.col}>
                <label className={styles.label} htmlFor="project">Project</label>
                <Select className={styles.input} field="project">
                  {projects.map((proj, i) => (
                    <Option key={i} value={proj.key}>{proj.name}</Option>
                  ))}
                </Select>
              </div>

              <div className={styles.col}>
                <label className={styles.label} htmlFor="location">Location</label>
                <Select className={styles.input} field="location">
                  {locations.map((loc, i) => (
                    <Option key={i} value={loc.key}>{loc.name}</Option>
                  ))}
                </Select>
              </div>

              <div className={styles.col}>
                <label className={styles.label} htmlFor="revision">Revision</label>
                <Select className={styles.input} field="revision">
                  {revisions.map((rev, i) => (
                    <Option key={i} value={rev.key}>{rev.name}</Option>
                  ))}
                </Select>
              </div>

              <div className={styles.col}>
                <label className={styles.label} htmlFor="words">Word Count</label>
                <Text
                  className={cn(
                    styles.input,
                    formApi.getError('words') && styles.error,
                  )}
                  field="words"
                  type="number"
                  validate={this::this._validateWords}
                />
              </div>
            </div>

            <div className={styles.buttons}>
              <button className={cn(styles.button, !activeSession && styles.green)} disabled={activeSession} type="submit">
                <Icon icon="play"/>
              </button>

              <button className={cn(styles.button, activeSession && styles.blue)} disabled={!activeSession} onClick={this::this._reset} type="reset">
                <Icon icon="times"/>
              </button>

              <button className={cn(styles.button, activeSession && styles.red)} disabled={!activeSession} type="submit">
                <Icon icon="stop"/>
              </button>
            </div>
          </Fragment>
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
