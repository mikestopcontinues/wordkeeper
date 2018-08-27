// import

const Sequelize = require('sequelize');
const {app} = require('electron');

const isDev = require('../common/isDev');

// db

const db = new Sequelize({
  dialect: 'sqlite',
  storage: `${app.getPath('userData')}/database.db`,
  database: 'db',
  username: 'root',
  password: null,
  logging: false,
});

// export

module.exports.db = db;
module.exports.Session = db.import('./models/session');

// sync

db.sync({force: isDev})
.then(() => {
  if (isDev) {
    require('./mocks/mocks')(db, exports);
  }
});
