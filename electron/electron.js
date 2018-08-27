// import

const {app} = require('electron');

require('./window');
require('./ipc');

// config

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;

if (process.platform === 'win32') {
  app.commandLine.appendSwitch('high-dpi-support', 'true');
  app.commandLine.appendSwitch('force-device-scale-factor', '1');
}

// events

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
