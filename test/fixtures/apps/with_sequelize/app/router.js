'use strict';

module.exports = function(app) {
  app.resources('eggs', '/eggs', app.controller.eggs);
};
