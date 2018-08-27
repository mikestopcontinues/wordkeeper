// import

const ipc = require('electron-better-ipc');

const {Session} = require('./database');
const types = require('../common/ipcTypes');

// events

ipc.answerRenderer(types.getSessions, async () => {
  return Session.findAll()
  .then((list) => list.map((s) => s.get({plain: true})))
  .catch(console.error);
});

ipc.answerRenderer(types.saveSession, async (session) => {
  return Session.upsert(session)
  .then(() => {
    return (session.id ?
      Session.findById(session.id) :
      Session.findOne({
        limit: 1,
        order: [['createdAt', 'DESC']],
      })
    )
    .then((s) => s.get({plain: true}));
  })
  .catch(console.error);
});
