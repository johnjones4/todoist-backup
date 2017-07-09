const request = require('request');
const fs = require('fs');

exports.backup = (config) => {
  return new Promise((resolve,reject) => {
    request({
      'url': 'https://todoist.com/API/v7/backups/get',
      'qs': {
        'token': config.token
      },
      'useQuerystring': true,
      'json': true
    },(err,response,body) => {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  }).then((backups) => {
    return new Promise((resolve,reject) => {
      if (backups && backups.length > 0) {
        const stream = fs.createWriteStream(config.backupPath);
        request({
          'url': backups[0].url
        })
          .pipe(stream)
          .on('error',(err) => {
            reject(err);
          })
          .on('close',(req) => {
            resolve();
          });
      } else {
        reject(new Error('Todoist API returned no backups.'));
      }
    });
  });
}
