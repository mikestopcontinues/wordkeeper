// import

import React, {Component} from 'react';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faBook, faCog, faDatabase, faChartLine, faEdit, faPlay, faPause, faStop, faTimes} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

// config

library.add(faBook, faCog, faDatabase, faChartLine, faEdit, faPlay, faPause, faStop, faTimes);

// component

export default class Icon extends Component {
  render() {
    const {...props} = this.props;

    return (
      <FontAwesomeIcon fixedWidth {...props}/>
    );
  }
}
