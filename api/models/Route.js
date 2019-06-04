/**
 * Route.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  dontUseObjectIds: true,
  attributes: {
    id: { type: "number", columnName: "_id" },
    Routeno: {
      type: "string"
    },
    from: {
      type: "string"
    },
    To: {
      type: "string"
    },
    time: {
      type: "string"
    },
    type: {
      type: "string"
    },
    price: {
      type: "string"
    },
    pricemonth: {
      type: "string"
    },
    distance: {
      type: "string"
    },
    waittime: {
      type: "string"
    },
    status: {
      type: "boolean"
    },

    // Add a reference to User

    places: {
      collection: "place",
      via: "routes"
    }
  },
  beforeCreate: function(obj, next) {
    Route.count().exec(function(err, cnt) {
      if (err) next(err);
      else {
        obj["id"] = cnt + 1;
        next(null);
      }
    });
  }
};
