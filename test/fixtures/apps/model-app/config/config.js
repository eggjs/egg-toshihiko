'use strict';

const password = exports.password = require('os').platform() === 'win32' ? 'Password12!' : '';

exports.toshihiko = {
  connections: {
    default: {
      dialect: 'mysql',
      database: 'egg-toshihiko',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password,
    },
    noBase: {
      database: 'mysql',
      password,
    },
  },
};

exports.keys = '0jN4FW7ZBjo4xtrLklDg4g==';
