// import

const _ = require('lodash');
const moment = require('moment');

// export

module.exports = {
  // dates

  day: {
    label: 'Days',
    cols: [
      'words',
      'wordsPerHour',
      'wordsPerDay',
      'wordsPerSprint',
      'minsPerSprint',
    ],
    groupBy(session) {
      return moment(session.startedAt).format('YYYY-MM-DD');
    },
  },

  week: {
    label: 'Weeks',
    cols: [
      'words',
      'wordsPerHour',
      'wordsPerDay',
      'wordsPerSprint',
      'minsPerSprint',
    ],
    groupBy(session) {
      const started = moment(session.startedAt);
      const weekStart = started.clone().startOf('isoweek');
      const weekEnd = started.clone().endOf('isoweek');

      return weekStart.format('\'YY MM/DD') + weekEnd.format('-MM/DD');
    },
    sortBy(row) {
      return moment(row.startedAt).format();
    },
  },

  month: {
    label: 'Months',
    cols: [
      'words',
      'wordsPerHour',
      'wordsPerDay',
      'wordsPerSprint',
      'minsPerSprint',
    ],
    groupBy(session) {
      return moment(session.startedAt).format('YYYY-MM');
    },
  },

  year: {
    label: 'Years',
    cols: [
      'words',
      'wordsPerHour',
      'wordsPerDay',
      'wordsPerSprint',
      'minsPerSprint',
    ],
    groupBy(session) {
      return moment(session.startedAt).format('YYYY');
    },
  },

  // cyclical

  hoursOfDay: {
    label: 'Hours of Day',
    groupBy(session) {
      return moment(session.startedAt).format('HH:00');
    },
  },

  daysOfWeek: {
    label: 'Days of Week',
    groupBy(session) {
      return moment(session.startedAt).format('dddd');
    },
    sortBy(row) {
      return [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ].indexOf(row.group);
    },
  },

  monthOfYear: {
    label: 'Months of Year',
    groupBy(session) {
      return moment(session.startedAt).format('MMMM');
    },
    sortBy(row) {
      return [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ].indexOf(row.group);
    },
  },

  // concentric

  concentricWeeks: {
    label: 'Recent Weeks',
    groupBy(session) {
      const started = moment(session.startedAt).startOf('day');

      const today = moment().startOf('day');
      const week1 = today.clone().subtract(7, 'days');
      const week2 = today.clone().subtract(14, 'days');
      const week3 = today.clone().subtract(21, 'days');
      const week4 = today.clone().subtract(28, 'days');

      return _.compact([
        'All Time',
        started.isAfter(week4) && 'Past 28 Days',
        started.isAfter(week3) && 'Past 21 Days',
        started.isAfter(week2) && 'Past 14 Days',
        started.isAfter(week1) && 'Past 7 Days',
      ]);
    },
    sortBy(row) {
      return [
        'All Time',
        'Past 28 days',
        'Past 21 days',
        'Past 14 days',
        'Past 7 days',
      ].indexOf(row.group);
    },
  },

  concentricEpochs: {
    label: 'Recent Periods',
    groupBy(session) {
      const started = moment(session.startedAt).startOf('day');

      const today = moment().startOf('day');
      const thisWeek = moment().startOf('isoweek');
      const thisMonth = moment().startOf('month');
      const thisYear = moment().startOf('year');

      return _.compact([
        'All Time',
        started.isAfter(thisYear) && 'This Year',
        started.isAfter(thisMonth) && 'This Month',
        started.isAfter(thisWeek) && 'This Week',
        started.isAfter(today) && 'Today',
      ]);
    },
    sortBy(row) {
      return [
        'All Time',
        'This Year',
        'This Month',
        'This Week',
        'Today',
      ].indexOf(row.group);
    },
  },

  // mins

  minsPerSprint: {
    label: 'Sprint Duration',
    groupBy(session) {
      const bucket = 5;
      const group = Math.round(session.mins / bucket) * bucket;

      return `${group} m`;
    },
    sortBy(row) {
      return parseInt(row.group);
    },
    filterBy(row, rows) {
      return row.sprints >= _.meanBy(rows, 'sprints');
    },
  },

  hoursPerDay: { // TODO: improve performance (using array of fns?)
    label: 'Work Hours/Day',
    groupBy(session, sessions) {
      const fraction = 4;
      const thisDay = moment(session.startedAt).format('YYYY-MM-DD');
      const daysSessions = _.filter(sessions, (s) => moment(s.startedAt).format('YYYY-MM-DD') === thisDay);
      const hours = _.sumBy(daysSessions, 'mins') / 60;
      const group = Math.round(hours * fraction) / fraction;

      return `${group} h`;
    },
    sortBy(row) {
      return parseFloat(row.group);
    },
    filterBy(row, rows) {
      return row.hours >= _.meanBy(rows, 'hours');
    },
  },

  // text fields

  project: {
    label: 'Projects',
    groupBy(session) {
      return session.location;
    },
  },

  where: {
    label: 'Locations',
    groupBy(session) {
      return session.location;
    },
  },

  revision: {
    label: 'Revisions',
    groupBy(session) {
      return session.revision;
    },
    sortBy(row) {
      return [
        'Plan',
        'Draft',
        'Story Edit',
        'Line Edit',
        'Copy Edit',
        'Proofread',
      ].indexOf(row.group);
    },
  },
};
