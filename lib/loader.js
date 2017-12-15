'use strict';

const path = require('path');

const _ = {
  pickBy: require('lodash.pickby'),
};
const Toshihiko = require('toshihiko');
const ToshihikoModel = require('toshihiko/lib/model');

const MODELS = Symbol('toshihikoLoadedModels');

function createConnections(app, connConfig) {
  const connections = Object.keys(connConfig).reduce((ret, key) => {
    const conf = connConfig[key];
    ret[key] = new Toshihiko.Toshihiko(conf.dialect, conf);
    return ret;
  }, {});

  app.toshi.get = function(name) {
    const ret = connections[name || 'default'];
    if (!ret) {
      const msg = `Toshihiko config ${name || 'default'} is not found.`;
      app.logger.error(msg);
      throw new Error(msg);
    }
    return ret;
  };

  app.toshi.define = function() {
    const toshihiko = this.get();
    return toshihiko.define.apply(toshihiko, arguments);
  };
}

function loadModel(app) {
  const modelDir = path.join(app.baseDir, 'app/model');
  app.loader.loadToApp(modelDir, MODELS, {
    inject: app,
    caseStyle: 'upper',
    ignore: 'index.js',
  });

  for (const name of Object.keys(app[MODELS])) {
    const klass = app[MODELS][name];

    // only this Toshihiko Model class
    if (klass instanceof ToshihikoModel) {
      app.model[name] = klass;
    }
  }
}

module.exports = function(app) {
  const defaultConfig = {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    connections: {},
  };
  const config = Object.assign(defaultConfig, app.config.toshihiko);

  app.toshi = app.toshihiko = Toshihiko;
  app.model = {};

  // add convenient Type accessor
  Object.keys(Toshihiko.Type).forEach(key => {
    Toshihiko[key] = Toshihiko.Type[key];
  });

  // merge default config to each connection
  const defaultConn = _.pickBy(config, (v, k) => k !== 'connections');
  const connections = config.connections || {};
  createConnections(app, Object.keys(connections).reduce((ret, key) => {
    ret[key] = Object.assign({}, defaultConn, connections[key]);
    return ret;
  }, {}));

  loadModel(app);
};
