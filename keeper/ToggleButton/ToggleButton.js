// import

import styles from './ToggleButton.css';

import React, {Component} from 'react';
import pt from 'prop-types';
import cn from 'classnames';

// component

export default class ToggleButton extends Component {
  static propTypes = {
    className: pt.any,
    color: pt.string,
    defaultOn: pt.bool,
    onChange: pt.func,
  };

  static defaultProps = {
    color: 'green',
    default: false,
  };

  state = {
    on: false,
  };

  componentDidMount() {
    const {defaultOn} = this.props;

    if (defaultOn) {
      this.setState({on: true});
    }
  }

  toggle() {
    const {onChange} = this.props;

    onChange(!this.state.on);
    this.setState({on: !this.state.on});
  }

  render() {
    const {className, color} = this.props;
    const {on} = this.state;

    return (
      <div className={cn(
        styles.ToggleButton,
        styles[color],
        on && styles.on,
        className,
      )} onClick={this::this.toggle}>
        <span className={styles.slider}/>
      </div>
    );
  }
}
