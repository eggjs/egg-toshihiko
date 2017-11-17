'use strict';

module.exports = function(app) {
  if (app.Toshi) return;

  const { STRING } = app.Sequelize;
  const Other = app.model.define('other', {
    name: { type: STRING }
  }, {
    tableName: 'other'
  });

  return Other;
};
