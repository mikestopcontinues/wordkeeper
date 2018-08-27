// import

const moment = require('moment');
const fs = require('fs-extra');
const glob = require('glob');

// export

module.exports = async (db, {Session}) => {
  const rows = glob.sync('electron/mocks/data/**/*.json')
  .reduce((data, file) => {
    return data.concat(fs.readJsonSync(file, 'utf8'));
  }, [])
  .filter((row) => [
    'project',
    'location',
    'type',
    'count',
    'start',
    'end',
  ].every((key) => !!row[key]))
  .map((row) => {
    return {
      project: row.project,
      location: row.location,
      revision: row.type,
      words: row.count,
      startedAt: moment(row.start).format(),
      stoppedAt: moment(row.end).format(),
      createdAt: moment(row.end).format(),
    };
  });

  await Session.bulkCreate(rows)
  .then(() => Session.count())
  .then((c) => console.log(`Added ${c} rows to Session table.`))
  .catch(console.error);
};
