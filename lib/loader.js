'use strict';

const path = require('path');

const _ = {
  pickBy: require('lodash.pickby')
};
const ettr = require('ettr');
const Toshihiko = require('toshihiko');
const ToshihikoModel = require('toshihiko/lib/model');

const MODELS = Symbol('toshihikoLoadedModels');

function loadModel(app) {
  const modelDir = path.join(app.baseDir, 'app/model');
  app.loader.loadToApp(modelDir, MODELS, {
    inject: app,
    caseStyle: 'upper',
    ignore: 'index.js'
  });

  for (const name of Object.keys(app[MODELS])) {
    const model = app[MODELS][name];

    if (model instanceof ToshihikoModel) {
      app.model[name] = model;
    }
  }
}

function createConnections(app, connConfig) {
  const connections = Object.keys(connConfig).reduce((ret, key) => {
    const conf = connConfig[key];
    ret[key] = new Toshihiko.Toshihiko(conf.dialect, conf);
    return ret;
  }, {});

  app.Toshi.get = function(name) {
    const ret = connections[name || 'default'];
    if(!ret) {
      const msg = `Toshihiko config ${name || 'default'} is not found.`;
      app.logger.error(msg);
      throw new Error(msg);
    }
    return ret;
  };

  app.Toshi.define = function() {
    const toshihiko = this.get();
    return toshihiko.define.apply(toshihiko, arguments);
  };
}

module.exports = function(app) {
  const defaultConfig = {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    connections: {}
  };
  const config = Object.assign(defaultConfig, app.config.toshihiko);

  app.Toshi = app.Toshihiko = Toshihiko;

  // add convenient Type accessor
  Object.keys(Toshihiko.Type).forEach(key => Toshihiko[key] = Toshihiko.Type[key]);

  // merge default config to each connection
  const defaultConn = _.pickBy(config, (v, k) => k !== 'connections');
  const connections = config.connections || {};
  createConnections(app, Object.keys(connections).reduce((ret, key) => {
    ret[key] = Object.assign(defaultConn, connections[key]);
    return ret;
  }, {}));

  // check if sequelize exists
  const ifSequelize = 'Sequelize' === ettr.get(app, 'model.constructor.name');

  if (!ifSequelize) {
    Object.defineProperty(app, 'model', {
      value: {},
      writable: false,
      configurable: false
    });
  }

  // because we can't get `Symbol('loadedModel')` in egg-sequelize, we must
  // load the models again even if egg-sequelize had loaded before.
  loadModel(app);
};
