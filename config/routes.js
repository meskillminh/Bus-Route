/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` your home page.            *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  "/": { view: "pages/homepage" },
  "POST /Place/findstop/": "PlaceController.findstop",
  "POST /Route/findroute/": "RouteController.findroute",
  "POST /Route/findfrom/": "RouteController.findfrom",
  "POST /Route/findstoproutes/": "RouteController.findstoproutes",
  "POST /Route/findoneroute/": "RouteController.findoneroute",
  "POST /Route/findstop/": "RouteController.findstop",
  "POST /Route/findstoptest/": "RouteController.findrouteTest",
  "POST /Route/findsingleroutes/": "RouteController.findsingleroutes",
  "POST /Route/test/": "RouteController.test",
  "POST /Route/findtworoutes/": "RouteController.findtworoutes",
  "POST /User/signup/": "UserController.signup",
  "POST /User/login/": "UserController.login",
  // "POST /Place/addplace/": "PlaceController.addplace",
  // "/addplace": { view: "pages/place_test" },
  "/addplace/": { view: "place" },
  "GET /Place/viewfromaddplace/": "PlaceController.viewfromaddplace",
  "GET /Place/list": "PlaceController.list",
  "POST /Place/addplace/": "PlaceController.addplace",
  "POST /Place/delete/:id": "PlaceController.delete",
  "GET /Place/edit/:id": "PlaceController.edit",
  "POST /Place/update/:id": "PlaceController.update",
  "POST /Place/find/": "PlaceController.findplacebyid",
  "POST /Place/deleteAll/": "PlaceController.deleteAll",
  // route
  "GET /Route/viewformaddroute/": "RouteController.viewformaddroute",
  "POST /Route/addroute/": "RouteController.addroute",
  "GET /Route/listroute": "RouteController.viewlistroute",
  "POST /Route/delete/:id": "RouteController.delete",
  "GET /Route/edit/:id": "RouteController.edit",
  // "POST /Route/sendplaces/": "RouteController.sendlistplaces"
  "POST /Route/update/:id": "RouteController.update",
  "POST /Route/find": "RouteController.find",
  "POST /Route/deleteAll/": "RouteController.deleteAll",
  "GET /Route/viewlistfindroute": "RouteController.viewlistfindroute",
  "POST /Route/findsgr/": "RouteController.find1route",
  //"POST /Route/findroutes": "RouteController.findtworoutes",
  "GET /Route/map/": "RouteController.viewmap",
  "POST /Route/waypoint/:id": "RouteController.listwaypoint",
  "GET /Route/all": "RouteController.routesData",
  "GET /Route/firstroute": "RouteController.routesDatafirst",
  "GET /Route/seccondroute": "RouteController.routesDataseccond",
  "POST /Route/findforadmin": "RouteController.findforadmin",

  //"POST /Route/vewobj/": "RouteController.viewrouteobj"
  "POST /Route/listwaypointof2route/:id":
    "RouteController.listwaypointof2route",
  "GET /Route/maptwo/": "RouteController.viewmaptwo",
  "GET /Place/distance": "PlaceController.getdistance",
  "GET /Place/findmap/": "PlaceController.viewmap",
  "POST /Place/getcoordinate": "PlaceController.getcoordinate",
  "GET /Place/datalistplace": "PlaceController.datalistplace",
  "GET /Place/data": "PlaceController.getdata",
  "GET /Place/viewmap1": "PlaceController.viewmap1",
  "POST /Route/findroutecoordinate/": "RouteController.find_route",
  "GET /Route/ts/": "RouteController.ts",
  "GET /Route/enduser/": "RouteController.viewlistroute",
  "GET /Admin": "RouteController.viewlistroutead",
  ////////////////////////////////////////
  // "get /login": { view: "user/login" },
  "get /loginpage": "UserController.viewlogin",
  "get /signuppage": "UserController.viewsignup",
  //"get /signup": { view: "user/signup" },
  "post /login": "UserController.login",
  "post /signup": "UserController.signup",
  // "GET /login": "UserController.viewloginpage",
  "/logout": "UserController.logout",
  "GET /User": "UserController.viewlistuser",
  "GET /edituser/:id": "UserController.edit",
  "POST /update/:id": "UserController.update",
  "POST /delete/:id": "UserController.delete",
  "POST /Route/viewrsfind": "RouteController.viewrsfind",
  "POST /Route/testfind": "RouteController.testoneroute"

  /***************************************************************************
   *                                                                          *
   * More custom routes here...                                               *
   * (See https://sailsjs.com/config/routes for examples.)                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the routes in this file, it   *
   * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
   * not match any of those, it is matched against static assets.             *
   *                                                                          *
   ***************************************************************************/
};
