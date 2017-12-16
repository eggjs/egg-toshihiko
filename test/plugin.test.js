'use strict';

const assert = require('assert');
const mm = require('egg-mock');
const request = require('supertest');
const Toshihiko = require('toshihiko');
const ToshihikoModel = require('toshihiko/lib/model');
const ToshihikoYukari = require('toshihiko/lib/yukari');

describe('test/plugin.test.js', () => {
  let app;
  before(() => {
    app = mm.app({
      baseDir: 'apps/model-app',
    });
    return app.ready();
  });

  after(mm.restore);

  describe('Base', () => {
    it('toshihiko init success', () => {
      assert(app.toshi);
      assert(app.toshihiko);
    });

    it('toshihiko types', () => {
      Object.keys(Toshihiko.Type).forEach(t => {
        assert.strictEqual(Toshihiko.Type[t], app.toshi[t]);
      });
    });

    it('ctx model property getter', () => {
      const ctx = app.mockContext();
      assert.ok(ctx.model);
      assert.ok(ctx.model.User);
    });

    it('has right tableName', () => {
      assert(app.model.User.name === 'users');
    });
  });

  describe('Connection', () => {
    it('should get right connection', () => {
      const toshihiko = app.toshi.get('default');
      assert(toshihiko instanceof Toshihiko.Toshihiko);
      assert.deepEqual(toshihiko.options, {
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'egg-toshihiko',
      });

      const noBase = app.toshi.get('noBase');
      assert(noBase instanceof Toshihiko.Toshihiko);
      assert.deepEqual(noBase.options, {
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'mysql',
      });
    });

    it('should get default connection', () => {
      const toshihiko = app.toshi.get();
      assert(toshihiko instanceof Toshihiko.Toshihiko);
      assert.deepEqual(toshihiko.options, {
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'egg-toshihiko',
      });
    });

    it('should define via default connection', () => {
      const M = app.toshihiko.define('m', []);
      assert(M.toshihiko === app.toshihiko.get());
      assert(M instanceof ToshihikoModel);
    });

    it('should not get a connection', () => {
      assert.throws(() => {
        app.toshi.get('temp');
      }, 'Toshihiko config temp is not found.');
    });
  });

  describe('Test model', () => {
    before(async () => {
      const noBase = app.toshi.get('noBase');
      const toshihiko = app.toshi.get();
      await noBase.execute('CREATE DATABASE IF NOT EXISTS `egg-toshihiko`;');
      await toshihiko.execute(`CREATE TABLE IF NOT EXISTS \`users\` (
          \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT,
          \`username\` varchar(20) NOT NULL DEFAULT '',
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;`);
    });

    it('User.test method work', function() {
      assert.equal(app.model.User.test(), 'hello');
    });

    it('should create', async () => {
      const user = await app.model.User.build({ username: 'xadillax' }).save();
      assert(user.username === 'xadillax');
      assert(typeof user.id === 'number');
      assert(user instanceof ToshihikoYukari);
    });
  });

  describe('Test controller', () => {
    after(async () => {
      const toshihiko = app.toshi.get();
      await toshihiko.execute('DROP DATABASE IF EXISTS `egg-toshihiko`;');
    });

    it('should get data from create', async () => {
      app.mockCsrf();

      const ret = await request(app.callback())
        .post('/users')
        .send({
          username: 'minary',
        });
      const json = JSON.parse(ret.text);
      assert(typeof json.id === 'number');
      assert(json.username = 'minary');

      const user = await app.model.User.where({
        username: 'minary',
      }).order({ id: -1 }).findOne();
      assert.deepEqual(user.toJSON(), json);

      const res = await request(app.callback())
        .get(`/users/${user.id}`);
      assert(res.status === 200);
      assert(res.body.username === 'minary');
    });
  });
});
