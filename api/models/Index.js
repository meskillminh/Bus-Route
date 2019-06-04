/**
 * Index.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  dontUseObjectIds: true,
  attributes: {
    id: { type: "number", columnName: "_id" },
    routeindex: { type: "json", columnType: "array" }
  },
  beforeCreate: function(obj, next) {
    Index.count().exec(function(err, cnt) {
      if (err) next(err);
      else {
        obj["id"] = cnt + 1;
        next(null);
      }
    });
  }
};
