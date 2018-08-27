// import

const _ = require('lodash');
const moment = require('moment');

// vars

const yearGoal = 500000;

// export

module.exports = function calcProgress(sessions) {
  const now = moment();
  const nextYear = moment([now.year() + 1]);

  const thisDay = moment().startOf('day');
  const thisWeek = moment().startOf('isoweek');
  const thisMonth = moment().startOf('month');
  const thisYear = moment().startOf('year');

  const theseSessions = sessions.filter((session) => {
    return moment(session.startedAt).isAfter(thisYear);
  });

  const wordCountSoFar = _.sumBy(theseSessions, 'words');

  const daysThisYear = nextYear.diff(thisYear, 'days');
  const baseWordsPerDay = yearGoal / (thisYear.isLeapYear() ? 366 : 365);
  const daysLeft = nextYear.diff(now.startOf('day'), 'days');
  const wordsNeeded = (daysThisYear * baseWordsPerDay) - wordCountSoFar;
  const wordsNeededPerDay = wordsNeeded / daysLeft;

  return [{
    group: 'today',
    target: Math.round(_.max([baseWordsPerDay, wordsNeededPerDay])),
    groupSessions: theseSessions.filter((session) => {
      return moment(session.startedAt).isAfter(thisDay);
    }),
  }, {
    group: 'this week',
    target: Math.round(_.max([baseWordsPerDay, wordsNeededPerDay]) * (now.diff(thisWeek, 'days') + 1)),
    groupSessions: theseSessions.filter((session) => {
      return moment(session.startedAt).isAfter(thisWeek);
    }),
  }, {
    group: 'this month',
    target: Math.round(_.max([baseWordsPerDay, wordsNeededPerDay]) * (now.diff(thisMonth, 'days') + 1)),
    groupSessions: theseSessions.filter((session) => {
      return moment(session.startedAt).isAfter(thisMonth);
    }),
  }, {
    group: 'this year',
    target: Math.round(_.max([baseWordsPerDay, wordsNeededPerDay]) * (now.diff(thisYear, 'days') + 1)),
    groupSessions: theseSessions,
  }].map((metric) => {
    const {target, groupSessions, group} = metric;
    const words = _.sumBy(groupSessions, 'words');
    const percentage = Math.floor(100 * words / target);

    return {group, words, target, percentage};
  });
};
