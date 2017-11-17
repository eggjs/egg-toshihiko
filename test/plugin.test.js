'use strict';

const assert = require('assert');

const mm = require('egg-mock');
const mysql = require('mysql2/promise');

describe('test/plugin.test.js', function() {
  let app;
  let connection;

  before(async function() {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root'
    });
    await connection.execute('DROP DATABASE IF EXISTS `egg_toshihiko_test`;');
    await connection.execute('CREATE DATABASE IF NOT EXISTS `egg_toshihiko_test`');
    await connection.execute('SHOW DATABASES;');
    app = mm.app({
      baseDir: 'apps/with_sequelize'
    });
    await app.ready();
  });

  after(async function() {
    await connection.execute('DROP DATABASE IF EXISTS `egg_toshihiko_test`;');
    connection.end();
    mm.restore();
  });

  describe('Base', function() {
    it('toshihiko init success', function() {
      // TODO
    })
  });
});
