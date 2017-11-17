'use strict';

exports.sequelize = {
  database: 'egg_toshihiko_test',
  dialect: 'mysql'
};

exports.toshihiko = {
  dialect: 'mysql',
  connections: {
    default: {
      database: 'egg_toshihiko_test'
    }
  }
};
