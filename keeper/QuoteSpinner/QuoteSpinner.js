// import

import React, {Component} from 'react';
import pt from 'prop-types';
import cn from 'classnames';
import posed from 'react-pose';
import _ from 'lodash';

import quotes from '../../common/quotes';

import styles from './QuoteSpinner.css';

// component

export const PosedQuote = posed.section({
  fadeIn: {
    opacity: 1,
    transition: {
      type: 'tween',
      duration: 1000 * 3,
      ease: 'easeInOut',
    },
  },
  fadeOut: {
    opacity: 0,
    transition: {
      type: 'tween',
      duration: 1000 * 3,
      ease: 'easeInOut',
    },
  },
});

export default class QuoteSpinner extends Component {
  static propTypes = {
    className: pt.any,
  };

  constructor() {
    super();

    this.state = {
      quote: quotes[_.random(0, quotes.length - 1)],
      pose: 'fadeIn',
    };

    this._fadeOut();
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  _fadeIn() {
    this.timeout = setTimeout(() => {
      this._fadeOut();
      this.setState({pose: 'fadeOut'});
    }, 1000 * 10);
  }

  _fadeOut() {
    this.timeout = setTimeout(() => {
      this._fadeIn();
      this.setState({
        pose: 'fadeIn',
        quote: quotes[(quotes.indexOf(this.state.quote) + 1) % quotes.length],
      });
    }, 1000 * 3);
  }

  render() {
    const {className} = this.props;
    const {quote, pose} = this.state;

    return (
      <div className={cn(styles.QuoteSpinner, className)}>
        <PosedQuote pose={pose}>
          <div className={styles.message}>{quote.message}</div>
          <div className={styles.author}>{quote.author}</div>
        </PosedQuote>
      </div>
    );
  }
}
