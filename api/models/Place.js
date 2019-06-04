/**
 * Place.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  dontUseObjectIds: true,
  attributes: {
    // id: { type: "number", columnName: "_id" },
    id: { type: "number", columnName: "_id" },
    Name: {
      type: "string"
    },
    Lat: {
      type: "string"
    },
    Long: {
      type: "string"
    },

    body_diacritic: {
      type: "string"
    },
    routes: {
      collection: "route",
      via: "places"
    }

    // Add a reference to Pet
  },
  beforeCreate: function(obj, next) {
    Place.count().exec(function(err, cnt) {
      if (err) next(err);
      else {
        obj["id"] = cnt + 1;
        next(null);
      }
    });
  }
};
