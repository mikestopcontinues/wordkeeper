// import

const express = require('express');
const webpack = require('webpack');
const devWare = require('webpack-dev-middleware');
const hotWare = require('webpack-hot-middleware');
const {spawn} = require('child_process');

const config = require('./webpack.config');

// config

const app = express();
const compiler = webpack(config);

app.use(devWare(compiler, {
  publicPath: config.output.publicPath,
  logLevel: 'error',
}));

app.use(hotWare(compiler, {
  log: false,
}));

// run

app.listen(8080, () => {
  spawn('electron', ['./electron/electron.js'], {
    shell: true,
    env: process.env,
    stdio: 'inherit',
  })
  .on('close', () => process.exit(0))
  .on('error', (err) => console.error(err));
});
