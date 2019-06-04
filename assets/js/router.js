var Router = function() {
  // this.buses = Buses;
  // this.penalty = 5000; /** 5km penalty for changing buses */
};

Router.prototype.unique = function(array) {
  return array.filter(function(item, pos) {
    return array.indexOf(item) == pos;
  });
};

/** stolen off http://stackoverflow.com/a/1885569 */
Router.prototype.intersect = function(array1, array2) {
  //   return this.unique(
  //     array1.filter(function(n) {
  //       return array2.indexOf(n) != -1;
  //     })
  //   );
  return array1.filter(value => array2.includes(value));
};

module.exports = Router;
