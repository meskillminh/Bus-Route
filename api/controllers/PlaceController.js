/**
 * PlaceController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

function convertDiacritic(strInput) {
  var str = strInput;
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
var data = {};
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
function findpalcebyid(id) {
  return new Promise((resolve, reject) => {
    Place.find({ id: id }).exec(function(err, result) {
      if (err) {
        reject(err);
      }

      resolve(result);
    });
  });
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
  console.log(listdistance);
  var y = listdistance.map(item => item.distance);
  console.log(y);
  var rs = Math.min(...y);
  console.log(rs);

  var y = listdistance.filter((item, index) => {
    if (item.distance == rs) {
      return item;
    }
  });

  var p = y.map(item => item.id);
  return p;
}
module.exports = {
  addplace: function(req, res) {
    if (!req.session.me) {
      res.redirect("/loginpage");
    } else {
      var Name = req.body.Name;
      var Lat = req.body.Lat;
      var Long = req.body.Long;
      var routes = [];
      routes = req.body.routes;
      console.log(Name);
      console.log(Lat);
      console.log(Long);

      Place.create({
        Name: Name,
        Lat: Lat,
        Long: Long,
        routes: routes
      }).exec(function(err) {
        if (err) {
          res.send(500, { error: "Database Error" });
        }

        res.redirect("/Place/list");
      });
    }
  },
  viewfromaddplace: function(req, res) {
    if (!req.session.me) {
      res.redirect("/loginpage");
    } else {
      Route.find({}).exec(function(err, routes) {
        if (err) {
          res.send(500, { error: "Database Error" });
        }
        res.view("place", { routes: routes });
      });
    }
  },
  findstop: function(req, res) {
    var stops = [];

    Place.find({})
      .populateAll()
      .exec(function(err, result) {
        if (err) {
          res.send(500, { error: "Database Error" });
        }
        //es.view("list", { busroutes: result });
        console.log(result);
        // stops = stops.push(result);
        res.send(result);
      });

    //  console.log(stops);
  },
  list: function(req, res) {
    Place.find({})
      .populateAll()
      .exec(function(err, places) {
        if (err) {
          res.send(500, { error: "database error" });
        }
        res.view("searchpage", { places: places });
        // res.send(places);
      });
  },
  delete: function(req, res) {
    if (!req.session.me) {
      res.redirect("/loginpage");
    } else {
      Place.destroy({ id: req.params.id }).exec(function(err) {
        if (err) {
          res.send(500, { err: "Database Error" });
        }
        res.redirect("/Place/list");
      });
      return false;
    }
  },
  edit: function(req, res) {
    if (!req.session.me) {
      res.redirect("/loginpage");
    } else {
      Place.findOne({ id: req.params.id })
        .populateAll()
        .exec(function(err, places) {
          if (err) {
            res.send(500, { error: "Database Error" });
          }
          //console.log(places);
          // result = places.routes[0].id;
          // res.view("place_edit", { places: places });
          res.view("place_edit", { places: places });

          //res.send(places);
        });
    }
  },
  update: function(req, res) {
    if (!req.session.me) {
      res.redirect("/loginpage");
    } else {
      var Name = req.body.Name;
      var Lat = req.body.Lat;
      var Long = req.body.Long;
      Place.update(
        { id: req.params.id },
        { Name: Name, Lat: Lat, Long: Long }
      ).exec(function(err) {
        if (err) {
          res.send(500, { error: "Database Error" });
        }
        res.redirect("/Place/list");
      });
    }
  },
  findplacebyid: function(req, res) {
    if (!req.session.me) {
      res.redirect("/loginpage");
    } else {
      var id = req.body.id;
      //var data = req.body;
      var checkid = isNaN(id);
      // console.log(checkid);
      if (checkid == false) {
        Place.find({ id: id })
          .populateAll()
          .exec(function(err, result) {
            if (err) {
              res.send(500, { error: "Database error" });
            }
            res.view("searchpage", { places: result });
          });
      } else {
        Place.find({
          // body_diacritic: { contains: convertDiacritic(data.id) }
          Name: id
        }).exec(function(err, result) {
          if (err) {
            res.send(500, { error: "Database Error" });
          }
          res.view("searchpage", { places: result });
        });
      }
    }
  },
  deleteAll: function(req, res) {
    Place.destroy({}).exec(function(err) {
      if (err) {
        res.send(500, { error: "Database Error" });
      }
      res.redirect("/Place/list");
    });
    return false;
  },
  getdistance: async function(req, res) {
    var listdistance = [];
    var obj = {};
    var lat1 = 10.7747678;
    var lon1 = 106.7056563;
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
    // console.log(listdistance);
    //console.log(...listdistance["distance"]);
    // var y = listdistance.map(item => item.distance);
    // var rs = Math.min(...[y]);
    // console.log(rs);
    // var found = listdistance.find(function(element) {
    //   element = listdistance.map(item => item.distance);
    //   if (element == rs) {
    //     return element;
    //   }
    // });
    // console.log(found);
    var s = 200;
    var y = listdistance.filter((item, index) => {
      if (item.distance < s) {
        return item;
      }
    });
    //console.log(highest)
    // console.log(y);
    var p = y.map(item => item.id);
    console.log(p);
  },
  viewmap: async function(req, res) {
    res.view("mapfindplace", { layout: "layouts/layoutfindplace" });
  },

  getcoordinate: async function(req, res) {
    var coordinates = req.body;
    //console.log(coordinates);
    var lat1 = coordinates[0];
    var lon1 = coordinates[1];
    console.log(lat1);
    console.log(lon1);
    var place = await getdistance(lat1, lon1);
    var place_nearest = await getdistancenearest(lat1, lon1);

    console.log(place);
    console.log("----------------------");
    console.log(place_nearest);

    var listplaces = [];

    for (var i = 0; i < place.length; i++) {
      var place1 = await findpalcebyid(place[i]);

      listplaces = listplaces.concat(place1);
    }
    nameplaces = [];
    stations = [];
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

    //console.log(stations);

    data = stations;
    //console.log(PlaceData);

    // res.view("mapfindplace", { layout: "layouts/layoutfindplace" });
    res.redirect("/Place/datalistplace");
  },
  datalistplace: function(req, res) {
    // console.log(data);
    res.send(data);
    // console.log(PlaceData);
  },

  getdata: function(req, res) {
    console.log("bbb");
    //console.log(data);
    res.send(data);
  },
  viewmap1: function(req, res) {
    res.view("mapfindplace1", { layout: "layouts/layoutmap" });
  }
};
