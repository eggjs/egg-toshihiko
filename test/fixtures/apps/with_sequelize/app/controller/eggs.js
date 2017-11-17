'use strict';

module.exports = function(app) {
  return class EggController extends app.Controller {
    *show() {
      this.ctx.body = 'hello';
    }
  };
};
