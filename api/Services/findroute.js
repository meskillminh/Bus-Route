// module.exports.findstoproutes = function (stop) {
//   //var stop1 = "aaa";
//   Place.find({ Name: stop }).exec(function(err, result) {
//     if (err) {
//       console.log("err");
//     }
//     console.log(result);
//     result();
//     return "aaa";
//   });
// };

var findroute = {
  findstoproutes: function find(stop) {
    Place.find({ Name: stop }).exec(function(err, result) {
      if (err) {
        console.log("err");
      }
      console.log(result);
      return "aaa";
    });
  }
};
module.exports = findroute;
