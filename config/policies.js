/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {
  "*": true,
  // UserController: {
  //   "*": "isAuthenticated",
  //   login: true,
  //   signup: true
  // },
  RouteController: {
    "*": "isAuthenticated",

    viewlistroute: true,
    find1route: true,
    findsingleroutes: true,
    findtworoutes: true,
    listwaypoint: true,
    viewmap: true,
    listwaypointof2route: true,
    viewmaptwo: true,
    routesData: true,
    routesDatafirst: true,
    routesDataseccond: true,
    find_route: true,
    find: true,
    viewrsfind: true,
    testoneroute: true
  },
  PlaceController: {
    //"*": "isAuthenticated",
    addplace: true,
    viewfromaddplace: true,
    delete: true,
    edit: true,
    update: true,
    findplacebyid: true
  }
};
