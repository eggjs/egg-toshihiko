'use strict';

module.exports = function(app) {
  if(!app.Toshi) return;

  const Type = app.Toshi.Type;

  const Egg = app.Toshi.define('eggs', [
    { name: 'eggId', column: 'egg_id', type: Type.Integer },
    { name: 'eggName', column: 'egg_name', type: Type.String },
    { name: 'createdAt', column: 'created_at', type: Type.Integer },
    { name: 'updatedAt', column: 'updated_at', type: Type.Integer }
  ]);

  return Egg;
};
