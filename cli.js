#! /usr/bin/env node

const minimist = require('minimist');
const path = require('path');
const fs = require('fs-extra');
const todoistBackup = require('./index');

const argv = minimist(process.argv.slice(2),{
  'default': {
    'config': path.join(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'],'.todoist-backup.json'),
  }
});

fs.readJson(argv.config)
  .then((config) => {
    return todoistBackup.backup(config);
  })
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(-1);
  })
