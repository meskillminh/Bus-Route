/**
 * RouteController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var Router = require("../../assets/js/router");

var router = new Router();
var resultfind1r = [];
var resultfind2r = [];
var listwasfind = [];
var s = {};
var routesData = {};
var routesDatafirst = {};
var routeDataseccond = {};
var routeobj = [];
var start;
var end;
var namefrom;
var nameto;
function findrouteobj(idobj) {
  console.log(idobj);
  var route = routeobj;
  console.log(route);
  var result = routeobj.filter(x => x.id == idobj).map(x => x.firstroute.id);
  console.log("----");
  // console.log(result);
  return result;
}
function intersect(array1, array2) {
  return array1.filter(value => array2.includes(value));
}

function deduplicate(arr) {
  let isExist = (arr, x) => arr.indexOf(x) > -1;
  let ans = [];

  arr.forEach(element => {
    if (!isExist(ans, element)) ans.push(element);
  });

  return ans;
}

function resolveAfter2Ss(stop) {
  return new Promise((resolve, reject) => {
    Place.find({ Name: stop })
      .populateAll()
      .exec(function(err, result) {
        if (err) {
          reject(err);
        }

        var ar = [];
        for (var i = 0; i < result[0].routes.length; i++) {
          var x = result[0].routes[i].id;
          ar.push(x);
        }

        resolve(ar);
      });
  });
}
function findroutebyplace(stop) {
  return new Promise((resolve, reject) => {
    Place.find({ Name: stop })
      .populateAll()
      .exec(function(err, result) {
        if (err) {
          reject(err);
        }

        resolve(result[0].routes);
      });
  });
}
function findidofplace(stop) {
  return new Promise((resolve, reject) => {
    Place.find({ Name: stop })
      .populateAll()
      .exec(function(err, result) {
        if (err) {
          reject(err);
        }

        resolve(result[0].id);
      });
  });
}

function findplace(routeid) {
  return new Promise((resolve, reject) => {
    Route.find({ id: routeid })
      .populateAll()
      .exec(function(err, result) {
        if (err) {
          reject(err);
        }
        var ar = [];
        for (var i = 0; i < result[0].places.length; i++) {
          var x = result[0].places[i].id;
          ar.push(x);
        }

        resolve(ar);
      });
  });
}

function findallroute(routeid) {
  return new Promise((resolve, reject) => {
    Route.find({ id: routeid })
      .populateAll()
      .exec(function(err, result) {
        if (err) {
          reject(err);
        }

        resolve(result);
      });
  });
}

function findroutebyid(id) {
  return new Promise((resolve, reject) => {
    Route.findOne({ id: id })
      .populateAll()
      .exec(function(err, result) {
        if (err) {
          reject(err);
        }

        resolve(result);
      });
  });
}

function findlistplace() {
  return new Promise((resolve, reject) => {
    Place.find({}).exec(function(err, result) {
      if (err) {
        reject(err);
      }

      resolve(result);
    });
  });
}
function findlistnameplace() {
  return new Promise((resolve, reject) => {
    Place.find({}).exec(function(err, result) {
      if (err) {
        reject(err);
      }
      var arrname = [];
      for (var i = 0; i < result.length; i++) {
        var name = result[i].Name;
        arrname.push(name);
      }
      resolve(arrname);
    });
  });
}

async function findsingleroutes(from, to) {
  // var fromroute = [];
  // fromroute = await resolveAfter2Ss(from);

  // var toroute = [];
  // toroute = await resolveAfter2Ss(to);

  // var r = intersect(fromroute, toroute);

  // return r;

  var idfrom = await findidofplace(from);

  var idto = await findidofplace(to);

  var place_from = await resolveAfter2Ss(from);

  var place_to = await resolveAfter2Ss(to);

  var result_place = await intersect(place_from, place_to);

  var stringfrom = idfrom.toString();

  var stringto = idto.toString();
  var result = [];
  for (var i = 0; i < result_place.length; i++) {
    index = await listindexplace(result_place[i]);

    var index_from = index.indexOf(stringfrom);

    var index_to = index.indexOf(stringto);

    if (index_from < index_to) {
      result.push(result_place[i]);
    } else {
      result = [];
    }
  }
  return result;
}
async function getlistroute(arr) {
  var resultall = [];

  for (var i = 0; i < arr.length; i++) {
    var result = await findroutebyid(arr[i]);
    resultall.push(result);
  }
  return new Promise((resolve, reject) => {
    resolve(resultall);
  });
}

async function getlistpalce(arr) {
  resultall = [];
  //console.log(arr);
  for (var i = 0; i < arr.length; i++) {
    var result = await findplace(arr[i]);
    resultall = resultall.concat(result);
  }
  return new Promise((resolve, reject) => {
    resolve(resultall);
  });
}
function findnameplace(id) {
  return new Promise((resolve, reject) => {
    Place.find({ id: id }).exec(function(err, result) {
      if (err) {
        reject(err);
      }
      //console.log(result[0].Name);
      resolve(result[0].Name);
    });
  });
}
function findlatplace(id) {
  return new Promise((resolve, reject) => {
    Place.find({ id: id }).exec(function(err, result) {
      if (err) {
        reject(err);
      }
      //console.log(result[0].Name);
      resolve(result[0].Lat);
    });
  });
}
function findlongplace(id) {
  return new Promise((resolve, reject) => {
    Place.find({ id: id }).exec(function(err, result) {
      if (err) {
        reject(err);
      }
      //console.log(result[0].Name);
      resolve(result[0].Long);
    });
  });
}
function createobject(id, middle, listfirstroute, listseccondroute) {
  // var listfirstroute = [];
  // var listseccondroute = [];
  var routes = {
    id: id,
    middle: middle,
    firstroute: listfirstroute,
    seccondroute: listseccondroute
  };
  return routes;
}
function createobjectwaypoit(Lat, Long, Name) {
  // var listfirstroute = [];
  // var listseccondroute = [];
  var station = {
    lat: Lat,
    lng: Long,
    name: Name
  };
  return station;
}
function getplaces(id) {
  return new Promise((resolve, reject) => {
    Route.find({ id: id })
      .populateAll()
      .exec(function(err, result) {
        if (err) {
          reject(err);
        }
        //console.log(result[0].Name);
        resolve(result[0].places);
        // console.log(result[0].places);
      });
  });
}
function findplacebyid(id) {
  return new Promise((resolve, reject) => {
    Place.find({ id: id }).exec(function(err, result) {
      if (err) {
        reject(err);
      }
      //console.log(result[0].Name);
      resolve(result);
    });
  });
}
function listplaceindex(id) {
  return new Promise((resolve, reject) => {
    Index.find({ id: id }).exec(async function(err, result1) {
      if (err) {
        reject(err);
      }
      var s = result1[0].routeindex;
      listplaces = [];
      for (var i = 0; i < s.length; i++) {
        var place = await findplacebyid(s[i]);

        listplaces = listplaces.concat(place);
      }
      resolve(listplaces);
    });
  });
}
function listindexplace(id) {
  return new Promise((resolve, reject) => {
    Index.find({ id: id }).exec(async function(err, result1) {
      if (err) {
        reject(err);
      }
      var s = result1[0].routeindex;

      resolve(s);
    });
  });
}

async function findseccondroute(from, to) {
  // from = req.body.from;
  // to = req.body.to;
  start = from;
  end = to;
  var fromroute = await resolveAfter2Ss(from);
  var toroute = await resolveAfter2Ss(to);

  z = await getlistpalce(fromroute);

  v = await getlistpalce(toroute);

  var r = intersect(z, v);

  var listpalce = deduplicate(r);

  arr1 = [];
  arr2 = [];
  var middleall = [];
  var firstroutesall = [];
  var seccondroutesall = [];
  var routes = [];
  for (var i = 0; i < listpalce.length; i++) {
    var middle = await findnameplace(listpalce[i]);

    middleall.push(middle);
    var firstroutes = await findsingleroutes(from, middle);

    arr1 = arr1.concat(firstroutes);
    var result1 = await getlistroute(firstroutes);

    var seccondroutes = await findsingleroutes(middle, to);

    arr2 = arr2.concat(seccondroutes);
    var result2 = await getlistroute(seccondroutes);

    var route = [];
    var id = i + 1;
    var route = createobject(id, middle, result1, result2);
    routes.push(route);
  }
  var routenew = [];
  var dem = 0;
  for (var a = 0; a < routes.length; a++) {
    for (var i = 0; i < routes[a].firstroute.length; i++) {
      for (var j = 0; j < routes[a].seccondroute.length; j++) {
        var id = dem + 1;
        routen = await createobject(
          id,
          routes[a].middle,
          routes[a].firstroute[i],
          routes[a].seccondroute[j]
        );
        dem++;
        routenew.push(routen);
      }
    }
  }

  routeobj = routenew;
  if (routenew.length > 0) {
    var routeno_firstroute = routenew[0].firstroute.Routeno;

    var routeno_seccondroute = routenew[0].seccondroute.Routeno;
    if (routeno_firstroute == routeno_seccondroute) {
      routenew = [];
      console.log("not found");
    } else {
      console.log(routenew);
    }
  } else {
    routenew = [];
    console.log("not found");
  }

  //  res.view("testfindresult", { routes: routenew });routeobj
  return routenew;
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
function createobjectdistance(id, distance) {
  // var listfirstroute = [];
  // var listseccondroute = [];
  var distance = {
    id: id,
    distance: distance
  };
  return distance;
}
async function getdistance(lat1, lon1) {
  var listdistance = [];
  var obj = {};
  // var lat1 = 10.7747678;
  // var lon1 = 106.7056563;
  result = await findlistplace();
  // console.log(result);
  var dem = 0;
  for (var i = 0; i < result.length; i++) {
    var lat2 = parseFloat(result[i].Lat);

    var lon2 = parseFloat(result[i].Long);
    var distance = getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);
    var obj = createobjectdistance(result[i].id, distance * 1000);
    listdistance.push(obj);
  }

  var s = 200;
  var y = listdistance.filter((item, index) => {
    if (item.distance < s) {
      return item;
    }
  });

  var p = y.map(item => item.id);
  return p;
}
async function getdistancenearest(lat1, lon1) {
  var listdistance = [];
  var obj = {};
  // var lat1 = 10.7747678;
  // var lon1 = 106.7056563;
  result = await findlistplace();
  // console.log(result);

  for (var i = 0; i < result.length; i++) {
    var lat2 = parseFloat(result[i].Lat);

    var lon2 = parseFloat(result[i].Long);
    var distance = getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);
    var obj = createobjectdistance(result[i].id, distance * 1000);
    listdistance.push(obj);
  }
  // console.log(listdistance);
  var y = listdistance.map(item => item.distance);
  //console.log(y);
  var rs = Math.min(...y);
  // console.log(rs);

  var y = listdistance.filter((item, index) => {
    if (item.distance == rs) {
      return item;
    }
  });

  var p = y.map(item => item.id);
  return p;
}
function findlistroute() {
  return new Promise((resolve, reject) => {
    Route.find({}).exec(function(err, result) {
      if (err) {
        reject(err);
      }

      resolve(result);
    });
  });
}
module.exports = {
  findroute: function(req, res) {
    var routeid = req.body.id;

    Route.find({ id: routeid })
      .populateAll()
      .exec(function(err, result) {
        if (err) {
          res.send(500, { error: "Database Error" });
        }
        //es.view("list", { busroutes: result });
        console.log(result);
        res.send(result);
      });
  },

  findrouteTest: function(req, res) {
    Route.find()
      .populateAll()
      .exec(function(err, result) {
        if (err) {
          res.send(500, { error: "Database Error" });
        }
        //es.view("list", { busroutes: result });
        res.send(result);
      });
  },

  findfrom: function(req, res) {
    var from = req.body.from;
    var froms = [];
    Route.find({ from: from }).exec(function(err, result) {
      if (err) {
        res.send(500, { error: "Database Error" });
      }
      //es.view("list", { busroutes: result });
      console.log(result);
      //froms = froms.push(result);
    });
    console.log(froms);
  },
  findpstoproutes: function(req, res) {
    var stop = req.stop;
    Place.find({ Name: stop })
      .populateAll()
      .exec(function(err, result) {
        if (err) {
          console.log("err");
        }

        res.send(stop);
      });
  },

  findstop: function(req, res) {
    var stop = req.body.Name;
    getBuss(stop).then(resp => {
      var result = resp;
      // res.send(result[0].routes);

      res.send(result);

      // findplaceofroute(result).then(respo => {
      //   var result1 = respo;
      //   console.log(result1);
      //   var x = [];
      //   x = result1.slice(-1);
      //   console.log(x);
      // });
      var ar = [];
      var ar2 = [];
      for (var i = 0; i < result.length; i++) {
        var x = result[i].id;
        ar.push(x);
      }
      // forearch(r in result[0]);
      // {
      //   var x = result[0].id;
      //   ar.push(x);
      // }

      console.log(ar);
      ar.forEach(r => {
        findplaceofroute(r).then(respo => {
          var result1 = respo;
          console.log(result1);
        });
      });
      //console.log(ar2);
    });
  },
  find1route: async function(req, res) {
    var from = req.body.from;
    var to = req.body.to;
    var routes = await findsingleroutes(from, to);
    var result = await getlistroute(routes);
    //console.log(result);
    //console.log(routes);
    res.view("findroute", { routes: result });
  },

  findsingleroutes: async function(req, res) {
    var router = new Router();
    var from = req.body.from;
    var to = req.body.to;
    console.log(from);
    console.log(to);
    var fromroute = [];
    fromroute = await resolveAfter2Ss(from);
    console.log(fromroute);
    var toroute = [];
    toroute = await resolveAfter2Ss(to);
    console.log(toroute);
    var r = intersect(fromroute, toroute);
    //console.log(r);

    r.forEach(r => {
      console.log(r);
      Route.find({ id: r }).exec(function(err, result) {
        if (err) {
          res.send(500, { error: "Database Error" });
        }
        // res.view("findroute", { routes: result });
        //routes.push(result);
        //console.log(result);
        routes = [];
        routes.push(result);
        console.log(routes);
        res.view("findroute", { routes: routes });
      });
    });
  },
  viewlistfindroute: function(req, res) {
    Route.find({})
      .populateAll()
      .exec(function(err, result) {
        if (err) {
          res.send(500, { error: "error" });
        }

        //res.send(result);
        res.view("findroute", { routes: result });
      });
  },
  test: async function(req, res) {
    // array1 = [1, 2, 3, 4];
    // array2 = [2, 3, 6];
    // //var router = new Router();
    // var r = intersect(array1, array2);
    // console.log(r);

    var stop = req.body.Name;
    // var result = [];
    var result = await resolveAfter2Ss(stop);
    // res.send(result);
    console.log(result);
    var y = [];
    var x = [];
    var h = new Promise((res, rej) => {
      result.map(async function(r, index) {
        x = await findallroute(r);
        // y = [...y, ...x];
        // if (index == r.length)
        res(x);

        //ar = ar.concat(r);

        //ar[i] = ar[i].concat(x);
      });
    });
    v = await h;
    res.send(v);
    // v.find({ To: "Le Loi" }).exec(function(err, kq) {
    //   if (err) {
    //     console.log("err");
    //   }
    //   res.send(kq);
    // });
  },
  findtworoutes: async function(req, res) {
    // var from = req.body.from;
    // console.log(from);

    // var to = req.body.to;
    // console.log(to);
    // start = from;
    // end = to;
    // var fromroute = await resolveAfter2Ss(from);
    // var toroute = await resolveAfter2Ss(to);

    // var routessg = await findsingleroutes(from, to);
    // console.log("--------");
    // console.log(routessg.length);
    // if (routessg.length > 0) {
    //   var result = await getlistroute(routessg);
    //   listwasfind = result;

    //   res.locals.layout = "layouts/layoutenduser";
    //   res.view("enduser", { routes1: result });
    // } else {
    //   z = await getlistpalce(fromroute);

    //   v = await getlistpalce(toroute);

    //   var r = intersect(z, v);

    //   var listpalce = deduplicate(r);

    //   arr1 = [];
    //   arr2 = [];
    //   var middleall = [];
    //   var firstroutesall = [];
    //   var seccondroutesall = [];
    //   var routes = [];
    //   for (var i = 0; i < listpalce.length; i++) {

    //     var middle = await findnameplace(listpalce[i]);

    //     middleall.push(middle);
    //     var firstroutes = await findsingleroutes(from, middle);

    //     arr1 = arr1.concat(firstroutes);
    //     var result1 = await getlistroute(firstroutes);

    //     var seccondroutes = await findsingleroutes(middle, to);

    //     arr2 = arr2.concat(seccondroutes);
    //     var result2 = await getlistroute(seccondroutes);

    //     var route = [];
    //     var id = i + 1;
    //     var route = createobject(id, middle, result1, result2);
    //     routes.push(route);
    //   }

    //   var routenew = [];
    //   var dem = 0;
    //   for (var a = 0; a < routes.length; a++) {
    //     for (var i = 0; i < routes[a].firstroute.length; i++) {
    //       for (var j = 0; j < routes[a].seccondroute.length; j++) {

    //         var id = dem + 1;
    //         routen = await createobject(
    //           id,
    //           routes[a].middle,
    //           routes[a].firstroute[i],
    //           routes[a].seccondroute[j]
    //         );
    //         dem++;
    //         routenew.push(routen);
    //       }
    //     }
    //   }

    //   routeobj = routenew;
    //   console.log(routeobj);
    var place2 = await findlistnameplace();
    var routes1 = await findlistroute();
    var from = req.body.from;

    var to = req.body.to;

    var result1 = await findsingleroutes(from, to);
    console.log(result1);
    if (result1.length > 0) {
      var result = await getlistroute(result1);

      res.locals.layout = "layouts/layoutenduser";
      res.view("enduser", {
        routes1: result,
        places1: place2,
        routes: routes1
      });
    }
    // if (result1 <= 0) {
    else {
      var result_seccond = await findseccondroute(from, to);
      res.locals.layout = "layouts/layoutenduser";
      res.view("enduser", {
        routes2: result_seccond,
        places1: place2,
        routes: routes1
      });
      // console.log(routenew);
    }

    // }

    //}
  },

  // admin function
  viewformaddroute: function(req, res) {
    if (!req.session.me) {
      res.redirect("/loginpage");
    } else {
      Place.find({}).exec(function(err, result) {
        if (err) {
          res.send(500, { error: "Database error" });
        }
        res.view("route", { places: result });
      });
    }
  },

  // admin function
  // viewformaddroute: function(req, res) {
  //   Place.find({}).exec(function(err, result) {
  //     if (err) {
  //       res.send(500, { error: "Database error" });
  //     }
  //     res.view("route", { places: result });
  //   });
  // },

  addroute: function(req, res) {
    if (!req.session.me) {
      res.redirect("/loginpage");
    } else {
      var matuyen = req.body.matuyen;
      var from = req.body.from;
      var To = req.body.to;
      var time = req.body.time;
      var type = req.body.type;
      var price = req.body.price;
      var pricemonth = req.body.pricemonth;
      var distance = req.body.distance;
      var waittime = req.body.waittime;
      var places = [];
      //places = req.body.places;
      places = req.body.places;
      status = req.body.status;
      // console.log(from);
      // console.log(places);
      // routes = req.body.route;
      // console.log(from);
      // console.log(routes);
      Index.create({ routeindex: places }).exec(function(err, result) {
        if (err) {
          res.send(500, { error: "Database err" });
        }
        Route.create({
          Routeno: matuyen,
          from: from,
          To: To,
          time: time,
          type: type,
          price: price,
          pricemonth: pricemonth,
          distance: distance,
          waittime: waittime,
          places: places,
          status: status
        }).exec(function(err, result1) {
          if (err) {
            res.send(500, { error: "Database Error" });
          }

          res.redirect("/Admin");

          // console.log(res);
        });
      });
    }
  },
  viewlistroute: async function(req, res) {
    var place = await findlistnameplace();
    Route.find({})
      .populateAll()
      .exec(function(err, result) {
        if (err) {
          res.send(500, { error: "Database Error" });
        }
        //  res.view("listroute", { routes: result });

        res.locals.layout = "layouts/layoutenduser";
        res.view("enduser", { routes: result, places1: place });

        // console.log(routes);
      });
  },
  viewlistroutead: function(req, res) {
    if (!req.session.me) {
      res.redirect("/loginpage");
    } else {
      Route.find({})
        .populateAll()
        .exec(function(err, result) {
          if (err) {
            res.send(500, { error: "Database Error" });
          }
          res.view("listroute", { routes: result });
        });
    }
  },

  Delete: function(req, res) {
    if (!req.session.me) {
      res.redirect("/loginpage");
    } else {
      Index.destroy({ id: req.params.id }).exec(async function(err, result1) {
        if (err) {
          res.send(500, { err: "err" });
        }
        Route.destroy({ id: req.params.id }).exec(function(err) {
          if (err) {
            res.send(500, { err: "Database Error" });
          }
          res.redirect("/Admin");
        });
      });
    }
  },
  edit: async function(req, res) {
    if (!req.session.me) {
      res.redirect("/loginpage");
    } else {
      // const routes = await findroutebyid(req.params.id);
      // const places = await findlistplace();
      var id = req.params.id;
      console.log(id);
      Index.find({ id: id }).exec(async function(err, result1) {
        if (err) {
          res.send(500, { err: "err" });
        }

        var s = result1[0].routeindex;
        console.log(s);

        const routes = await findroutebyid(req.params.id);
        const places = await findlistplace();

        var arrplace = [];

        for (var i = 0; i < s.length; i++) {
          console.log(s[i]);
          var place = await findplacebyid(s[i]);

          arrplace = arrplace.concat(place);
        }
        console.log(arrplace);
        res.view("route_edit", { routes, places, indexplace: arrplace });
      });
    }
  },
  update: function(req, res) {
    if (!req.session.me) {
      res.redirect("/loginpage");
    } else {
      var matuyen = req.body.matuyen;
      var from = req.body.from;
      var To = req.body.to;
      var time = req.body.time;
      var type = req.body.type;
      var price = req.body.price;
      var pricemonth = req.body.pricemonth;
      var distance = req.body.distance;
      var waittime = req.body.waittime;
      var status = req.body.status;
      var places = [];

      places = req.body.places;
      console.log(places);
      Index.update({ id: req.params.id }, { routeindex: places }).exec(
        async function(err, result1) {
          if (err) {
            res.send(500, { err: "err" });
          }
          Route.update(
            { id: req.params.id },
            {
              Routeno: matuyen,
              from: from,
              To: To,
              time: time,
              type: type,
              price: price,
              pricemonth: pricemonth,
              distance: distance,
              waittime: waittime,
              status: status,
              places: places
            }
          ).exec(function(err) {
            if (err) {
              res.send(500, { error: "Database Error" });
            }
            res.redirect("/Admin");
          });
        }
      );
    }
  },
  find: function(req, res) {
    var searchtext = req.body.searchtext;
    console.log(searchtext);
    var checkid = isNaN(searchtext);
    if (checkid == false) {
      Route.find({ Routeno: searchtext })
        .populateAll()
        .exec(function(err, result) {
          if (err) {
            res.send(500, { error: "Database error" });
          }
          // res.view("listroute", { routes: result });
          // res.view(
          //   "enduser",
          //   { layout: "layouts/layoutenduser" },
          //   { routes: result }
          // );
          console.log(result);
          res.locals.layout = "layouts/layoutenduser";
          res.view("enduser", { routes: result });
        });
    } else {
      Route.find()
        .where({ or: [{ from: searchtext }, { To: searchtext }] })
        .exec(function(err, result) {
          if (err) {
            res.send(500, { error: "Database Error" });
          }
          // res.view(
          //   "enduser",
          //   { layout: "layouts/layoutenduser" },
          //   { routes: result }
          // );
          console.log(result);
          res.locals.layout = "layouts/layoutenduser";
          res.view("enduser", { routes: result });
        });
    }
  },
  findforadmin: function(req, res) {
    if (!req.session.me) {
      res.redirect("/loginpage");
    } else {
      var searchtext = req.body.searchtext;
      console.log(searchtext);
      var checkid = isNaN(searchtext);
      if (checkid == false) {
        Route.find({ Routeno: searchtext })
          .populateAll()
          .exec(function(err, result) {
            if (err) {
              res.send(500, { error: "Database error" });
            }
            // res.view("listroute", { routes: result });
            // res.view(
            //   "enduser",
            //   { layout: "layouts/layoutenduser" },
            //   { routes: result }
            // );
            console.log(result);

            res.view("listroute", { routes: result });
          });
      } else {
        Route.find()
          .where({ or: [{ from: searchtext }, { To: searchtext }] })
          .exec(function(err, result) {
            if (err) {
              res.send(500, { error: "Database Error" });
            }
            // res.view(
            //   "enduser",
            //   { layout: "layouts/layoutenduser" },
            //   { routes: result }
            // );
            console.log(result);
            // res.locals.layout = "layouts/layoutenduser";
            res.view("listroute", { routes: result });
          });
      }
    }
  },
  deleteAll: function(req, res) {
    Index.destroy({ id: req.params.id }).exec(async function(err, result1) {
      if (err) {
        res.send(500, { err: "err" });
      }
      Route.destroy({}).exec(function(err) {
        if (err) {
          res.send(500, { error: "Database Error" });
        }
        res.redirect("/Route/listroute");
      });
    });
  },
  viewmap: function(req, res) {
    //res.view("map", { layout: "layouts/layoutmap" });
    //res.view("map", { stations });
    res.view("maptworoute", { layout: "layouts/layoutmaptwo" });
  },
  listwaypoint: async function(req, res) {
    // var from = req.body.from;
    // var To = req.body.to;
    // var waypoint = await findsingleroutes(from, To);
    // var listplaces = await getlistpalce(waypoint);
    // console.log(listplaces);
    var place2 = await findlistnameplace();
    var id = req.params.id;

    Index.find({ id: id }).exec(async function(err, result1) {
      if (err) {
        res.send(500, { err: "err" });
      }

      var s = result1[0].routeindex;

      var listplaces = [];

      for (var i = 0; i < s.length; i++) {
        console.log(s[i]);
        var place = await findplacebyid(s[i]);

        listplaces = listplaces.concat(place);
      }
      nameplaces = [];
      stations = [];
      console.log(start);
      // let indexstart = listplaces.indexOf(start);
      console.log(end);
      // let indexend = listplaces.indexOf(end);
      // var arr = listplaces.slice(indexstart, indexend);
      // console.log(arr);
      for (var i = 0; i < listplaces.length; i++) {
        // var name = await findnameplace(listplaces[i]);

        // var lat = await findlatplace(listplaces[i]);
        // var Lat = parseFloat(lat);
        // var long = await findlongplace(listplaces[i]);
        // var Long = parseFloat(long);
        // var station = createobjectwaypoit(Lat, Long, name);
        // stations.push(station);

        var name = listplaces[i].Name;
        var lat = listplaces[i].Lat;
        var Lat = parseFloat(lat);
        //console.log(Lat);
        var long = listplaces[i].Long;
        var Long = parseFloat(long);
        var station = createobjectwaypoit(Lat, Long, name);
        stations.push(station);
      }

      console.log(stations);

      routesData = stations;

      // res.view("map", { layout: "layouts/layoutenduser" });
      Route.find({ id: id })
        .populateAll()
        .exec(async function(err, rs) {
          if (err) {
            res.send(500, { err: "Db err" });
          }
          var arrplace = [];

          for (var i = 0; i < s.length; i++) {
            console.log(s[i]);
            var place = await findplacebyid(s[i]);

            arrplace = arrplace.concat(place);
          }
          res.locals.layout = "layouts/layoutenduser";
          res.view("enduser", {
            routedt: rs,
            indexroute: arrplace,
            places1: place2
          });
        });
    });
  },

  listwaypointof2route: async function(req, res) {
    var id = req.params.id;
    var idfirstroute = routeobj
      .filter(x => x.id == id)
      .map(x => x.firstroute.id);
    var idseccondroute = routeobj
      .filter(x => x.id == id)
      .map(x => x.seccondroute.id);
    var item = routeobj.find(item => item.id == id);
    console.log(item.middle);
    middle = item.middle;
    var place2 = await findlistnameplace();
    ///////////////

    // var Namefirstroute = routeobj
    //   .filter(x => x.id == id)
    //   .map(x => x.firstroute.name);
    //console.log(routeobj);

    ////////////////

    var listplacesfirst = await listplaceindex(idfirstroute);
    var arrall = [];

    for (var i = 0; i < listplacesfirst.length; i++) {
      arr = listplacesfirst[i].Name;
      arrall.push(arr);
    }

    //console.log(arrall);
    console.log(start);
    let indexstart = arrall.indexOf(start);
    let index = arrall.indexOf(middle);

    console.log(index);
    var listfirst = listplacesfirst.slice(indexstart, index + 1);
    console.log(listfirst);
    var listplacesseccond = await listplaceindex(idseccondroute);
    var arrall2 = [];
    for (var i = 0; i < listplacesseccond.length; i++) {
      arr = listplacesseccond[i].Name;
      arrall2.push(arr);
    }

    let indexend = arrall2.indexOf(end);
    let index1 = arrall2.indexOf(middle);
    var listseccond = listplacesseccond.slice(index1, indexend + 1);
    console.log("-------------------------");
    console.log(end);
    console.log(indexend);

    console.log(listseccond);

    nameplaces = [];
    stationsf = [];
    stationse = [];
    for (var i = 0; i < listfirst.length; i++) {
      var name = listfirst[i].Name;
      var lat = listfirst[i].Lat;
      var Lat = parseFloat(lat);

      var long = listfirst[i].Long;
      var Long = parseFloat(long);
      var station = createobjectwaypoit(Lat, Long, name);
      stationsf.push(station);
    }
    for (var i = 0; i < listseccond.length; i++) {
      var name = listseccond[i].Name;
      var lat = listseccond[i].Lat;
      var Lat = parseFloat(lat);

      var long = listseccond[i].Long;
      var Long = parseFloat(long);
      var station = createobjectwaypoit(Lat, Long, name);
      stationse.push(station);
    }
    console.log("---Places first route---");
    console.log(stationsf);

    routesDatafirst = stationsf;
    console.log("---Places seccond route---");
    console.log(stationse);
    routeDataseccond = stationse;
    s = stationse;

    //res.view("maptworoute", { layout: "layouts/layoutmaptwo" });
    res.locals.layout = "layouts/layoutenduser";
    res.view("maptworoute", { places1: place2 });
  },
  viewmaptwo: function(req, res) {
    res.view("maptworoute", { layout: "layouts/layoutenduser" });
  },

  routesData: function(req, res) {
    res.send(routesData);
  },
  routesDatafirst: function(req, res) {
    res.send(routesDatafirst);
  },
  routesDataseccond: function(req, res) {
    console.log("aaa");
    console.log(s);
    console.log("-----------------");
    res.send(routeDataseccond);
  },
  find_route: async function(req, res) {
    console.log("Aaaaaaaaa");
    var coordinates = req.body;

    lat1 = coordinates[0];
    lon1 = coordinates[1];
    lat2 = coordinates[2];
    lon2 = coordinates[3];
    console.log("------------");
    console.log(lat1);
    console.log(lon1);
    console.log(lat2);
    console.log(lon2);

    var place_from_nearest = await getdistancenearest(lat1, lon1);

    console.log(place_from_nearest);
    var place_to_nearest = await getdistancenearest(lat2, lon2);
    console.log(place_to_nearest);
    var from = await findnameplace(place_from_nearest);
    console.log("điểm đi gần nhất");
    console.log(from);
    namefrom = from;
    var to = await findnameplace(place_to_nearest);
    console.log("điểm đến gần nhất");
    console.log(to);
    nameto = to;

    var place_from_near = await getdistance(lat1, lon1);
    var place_to_near = await getdistance(lat2, lon2);
    console.log(place_from_near);
    console.log(place_to_near);
    var arr = [];
    var arr1 = [];
    for (var i = 0; i < place_from_near.length; i++) {
      for (var j = 0; j < place_to_near.length; j++) {
        var f = await findnameplace(place_from_near[i]);
        //console.log(f);
        var t = await findnameplace(place_to_near[j]);
        //   console.log(t);
        var oneroute = await findsingleroutes(f, t);

        if (oneroute.length > 0) {
          console.log("1 chuyến");
          console.log("From");
          console.log(f);
          console.log("To");
          console.log(t);
          var rs = await getlistroute(oneroute);
          console.log(rs);
          console.log("-------------");
          arr = arr.concat(oneroute);
        } else {
          var scroute = await findseccondroute(f, t);
          console.log("2 route");
          console.log("from");
          console.log(from);
          console.log("to");
          console.log(to);

          console.log(scroute);
          console.log("bbbb");
          console.log("--------------");
          arr1 = arr1.concat(scroute);
          //console.log(scroute);
          // if (scroute.length > 0) {
          //   console.log("djclj");
          //   //console.log(scroute);
          //   var rsf = await getlistroute(scroute);
          //   console.log(rsf);
          // }
        }
      }
    }
    resultfind1r = arr;
    resultfind2r = arr1;
    // console.log("--------------");

    // var oneroute = await findsingleroutes(from, to);
    // console.log("1 route");
    // console.log(oneroute);
    // if (oneroute.length > 0) {
    //   var result = await getlistroute(oneroute);
    //   //   // res.view("findroute", { routes: result });
    //   //   // console.log(result);
    //   res.locals.layout = "layouts/layoutenduser";
    //   res.view("enduser", { routes1: result });
    //   //   namefrom = from;
    // } else {
    //   // console.log("1 route");
    //   place_from_near = await getdistance(lat1, lon1);
    //   console.log("tram xung quanh1");
    //   console.log(place_from_nearest);
    //   place_to_near = await getdistance(lat2, lon2);
    //   console.log("tram xung quanh2");
    //   console.log(place_to_nearest);
    //   for (var i = 0; i < place_from_near.length; i++) {
    //     for (var j = 0; j < place_to_nearest.length; j++) {
    //       var oneroute1 = await findsingleroutes(
    //         place_from_nearest[i],
    //         place_to_nearest[j]
    //       );
    //       if (oneroute1.length > 0) {
    //         var result1 = await getlistroute(oneroute1);
    //         res.locals.layout = "layouts/layoutenduser";
    //         res.view("enduser", { routes1: result1 });
    //       } else {
    //         var scroute = findseccondroute(
    //           place_from_nearest[i],
    //           place_to_nearest[j]
    //         );
    //         if (scroute.length > 0) {
    //           console.log("2 route");
    //           console.log(scroute);
    //           res.locals.layout = "layouts/layoutenduser";
    //           res.view("enduser", { routes2: scroute });
    //         }
    //       }
    //     }

    //   var from1 = await findnameplace(place_from_near[i]);
    //   var oneroute1 = await findsingleroutes(from1, to);
    //   if (oneroute1.length > 0) {
    //     // var result = await getlistroute(oneroute1);
    //     // console.log("1 route");
    //     // console.log(result);
    //     // res.locals.layout = "layouts/layoutenduser";
    //     // res.view("enduser", { routes1: result });
    //     namefrom = from1;
    //   }
    // }
    // var resultscr = await findseccondroute(from, to);
    // console.log("2 route");
    // console.log(resultscr);
    // // res.locals.layout = "layouts/layoutenduser";
    // // res.view("enduser", { routes2: resultscr });
    // namefrom = from;
    //   }
    // }
  },
  viewrsfind: async function(req, res) {
    console.log("xkjckc");
    //  console.log(resultfind1r);
    var arrs = resultfind1r;
    var arr1 = resultfind2r;
    console.log(arr1);
    // console.log(arrs);
    var result1 = await getlistroute(resultfind1r);
    console.log(result1);
    res.locals.layout = "layouts/layoutenduser";
    res.view("enduser", { routes1: result1, routes2: arr1 });
    // console.log(result1);
  },
  testoneroute: async function(req, res) {
    console.log("djkc");
    var from = req.body.from;

    var to = req.body.to;

    var result1 = await findsingleroutes(from, to);
    console.log(result1);
    if (result1 > 0) {
      var result = await getlistroute(result1);

      res.locals.layout = "layouts/layoutenduser";
      res.view("enduser", { routes1: result });
    }
    if (result1 <= 0) {
      var result_seccond = await findseccondroute(from, to);
    }
  }

  // viewenduser: function(req, res) {
  //   res.view("enduser", { layout: "layouts/layoutenduser" });
  // }
};
