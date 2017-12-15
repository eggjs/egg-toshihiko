'use strict';

module.exports = app => {
  return class UsersController extends app.Controller {
    async show() {
      const user = await this.ctx.model.User.findById(this.ctx.params.id);
      this.ctx.body = user;
    }

    async create() {
      this.ctx.body = await app.model.User.build({
        username: this.ctx.request.body.username,
      }).save();
    }
  };
};
