// import

const _ = require('lodash');
const moment = require('moment');

// fns

function filter(rows, filterBy) {
  return rows.filter((row) => {
    return filterBy(row, rows);
  });
}

// export

module.exports = function groupSessions(sessions, opts = {}) {
  const {clipBy, groupBy, sortBy, filterBy} = opts;

  return _.chain(sessions)

  // group into multiple groups...

  .reduce((res, session) => {
    let groups = groupBy(session, sessions);

    if (!_.isArray(groups)) {
      groups = [groups];
    }

    _(groups)
    .compact()
    .forEach((group) => {
      if (!res[group]) {
        res[group] = [];
      }

      res[group].push(session);
    });

    return res;
  }, {})

  // aggregate data...

  .map((these, group) => {
    const res = {group};

    res.startedAt = _.minBy(these, 'startedAt');
    res.stoppedAt = _.maxBy(these, 'stoppedAt');

    res.words = _.sumBy(these, 'words');
    res.sprints = these.length;

    res.mins = _.sumBy(these, 'mins');
    res.days = _.uniqBy(these, (s) => {
      return moment(s.startedAt).format('YYYY-MM-DD');
    }).length;
    res.hours = res.mins / 60;

    res.wordsPerSprint = Math.round(res.words / res.sprints);
    res.wordsPerHour = Math.round(res.words / res.hours);
    res.wordsPerDay = Math.round(res.words / res.days);

    res.minsPerSprint = Math.round(res.mins / res.sprints);
    res.minsPerDay = Math.round(res.mins / res.days);

    res.sprintsPerDay = Math.round(res.sprints / res.days);

    return res;
  })

  // set ascending sort for row.group...

  .sortBy(sortBy || 'group')

  // filter and/or clip rows...

  .thru((rows) => {
    if (_.isNumber(filterBy)) {
      rows = rows.filter((row) => row.sprints >= filterBy);
    } else if (_.isFunction(filterBy)) {
      rows = filter(rows, filterBy);
    }

    if (_.isNumber(clipBy)) {
      rows = rows.slice(clipBy * -1);
    } else if (_.isFunction(clipBy)) {
      rows = filter(rows, clipBy);
    }

    return rows;
  })
  .value();
};
