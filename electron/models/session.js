// import

const moment = require('moment');

// fns

function createDateGetter(key) {
  return function () {
    return moment(this.getDataValue(key)).format();
  };
}

// export

module.exports = (db, type) => {
  return db.define('session', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    project: {
      type: type.STRING(64),
      allowNull: false,
    },
    location: {
      type: type.STRING(32),
      allowNull: false,
    },
    revision: {
      type: type.STRING(32),
      allowNull: false,
    },
    note: {
      type: type.TEXT,
      allowNull: true,
    },
    words: {
      type: type.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
      },
    },
    startedAt: {
      type: type.DATE,
      allowNull: false,
      validate: {
        isDate: true,
      },
      get: createDateGetter('startedAt'),
    },
    stoppedAt: {
      type: type.DATE,
      allowNull: true,
      validate: {
        isDate: true,
      },
      get: createDateGetter('stoppedAt'),
    },
    createdAt: {
      type: type.DATE,
      validate: {
        isDate: true,
      },
    },
    updatedAt: {
      type: type.DATE,
      validate: {
        isDate: true,
      },
    },
    deletedAt: {
      type: type.DATE,
      validate: {
        isDate: true,
      },
    },
  }, {
    paranoid: true,
    indexes: [],
  });
};
