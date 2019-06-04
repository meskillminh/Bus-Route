"use strict";
function resolveAfter2Ss(stop) {
  return new Promise((resolve, reject) => {
    Place.find({ Name: stop })
      .populateAll()
      .exec(function(err, result) {
        if (err) {
          reject(err);
        }

        // Route.find({ places: result.id }).exec(function(err, result1) {
        //   if (err) {
        //     reject(err);
        //   }
        // console.log(result.id)
        resolve(result[0].routes);
      });
  });
}
var MyFirstService = {
  /**
   * Showing how to write our first service
   * @return {String}
   */

  sayHello: function sayHelloService(stop) {
    var r1;
    var result;
    result = resolveAfter2Ss(stop);
    return result;
  }
};

module.exports = MyFirstService;
