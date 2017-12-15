'use strict';

module.exports = app => {
  const User = app.toshi.define('users', [
    { name: 'id', type: app.toshi.Integer, primaryKey: true },
    { name: 'username', type: app.toshi.String },
  ]);

  User.test = function() {
    return 'hello';
  };

  return User;
};
