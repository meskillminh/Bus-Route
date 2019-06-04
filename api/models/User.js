/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  dontUseObjectIds: true,

  attributes: {
    user_id: { type: "number" },
    firstname: {
      type: "string",
      required: true
    },
    lastname: {
      type: "string",
      required: true
    },
    email: {
      type: "string",
      isEmail: true,
      required: true
    },
    password: {
      type: "string",
      required: true
    }
  },

  beforeCreate: function(obj, next) {
    User.count().exec(function(err, cnt) {
      if (err) next(err);
      else {
        obj["user_id"] = cnt + 1;
        next(null);
      }
    });
  },
  attemptLogin: function(inputs, cb) {
    // Create a user
    User.findOne({
      email: inputs.email,
      // TODO: But encrypt the password first
      password: inputs.password
    }).exec(cb);
  }
};
