/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  viewlogin: function(req, res) {
    res.view("user/login", { layout: "layouts/loginlayout" });
  },
  viewsignup: function(req, res) {
    if (!req.session.me) {
      res.redirect("/loginpage");
    } else {
      res.view("user/signup");
    }
  },
  signup: function(req, res) {
    if (!req.session.me) {
      res.redirect("/loginpage");
    } else {
      var firstname = req.body.firstname;
      var lastname = req.body.lastname;
      var email = req.body.email;
      var password = req.body.password;
      User.create({
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password
      }).exec(function(err) {
        if (err) {
          // res.send(500, { error: "Database Error" });
          res.redirect("/signuppage");
        }

        // res.send("create account successfully");
        res.redirect("/User");
      });
    }
  },
  // login: function(req, res) {
  //   var email = req.body.email;
  //   var password = req.body.password;
  //   User.find({ email: email, password: password }).exec(function(err, result) {
  //     if (err) {
  //       res.send("can't login");
  //     }
  //     res.send(result);
  //   });
  // }
  login: function(req, res) {
    // See `api/responses/login.js`
    return res.login({
      email: req.param("email"),
      password: req.param("password"),
      successRedirect: "/Admin",
      invalidRedirect: "/loginpage"
    });
  },
  logout: function(req, res) {
    // "Forget" the user from the session.
    // Subsequent requests from this user agent will NOT have `req.session.me`.
    req.session.me = null;

    // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
    // send a simple response letting the user agent know they were logged out
    // successfully.
    if (req.wantsJSON) {
      return res.ok("Logged out successfully!");
    }

    // Otherwise if this is an HTML-wanting browser, do a redirect.
    return res.redirect("/loginpage");
  },
  viewlistuser: function(req, res) {
    if (!req.session.me) {
      res.redirect("/loginpage");
    } else {
      User.find({}).exec(function(err, result) {
        if (err) {
          res.send(500, { error: "Db error" });
        }
        res.view("user/listuser", { user: result });
      });
    }
  },
  edit: function(req, res) {
    if (!req.session.me) {
      res.redirect("/loginpage");
    } else {
      // var id = req.params.user_id;
      //console.log(id);
      var id = req.params.id;
      console.log(id);
      User.find({ user_id: id }).exec(function(err, result) {
        if (err) {
          res.send(500, { error: "Db err" });
        }
        res.view("user/edituser", { User: result[0] });
        //console.log(result[0]);
      });
    }
  },
  update: function(req, res) {
    if (!req.session.me) {
      res.redirect("/loginpage");
    } else {
      console.log("aaaaaaaaaa");
      var id = req.params.id;
      var firstname = req.body.firstname;
      var lastname = req.body.lastname;
      var email = req.body.email;
      var password = req.body.password;
      User.update(
        { user_id: id },
        {
          firstname: firstname,
          lastname: lastname,
          email: email,
          password: password
        }
      ).exec(function(err) {
        if (err) {
          // res.send(500, { error: "Database Error" });
          res.redirect("/edituser/:id");
        }

        // res.send("create account successfully");
        res.redirect("/User");
      });
    }
  },
  delete: function(req, res) {
    if (!req.session.me) {
      res.redirect("/loginpage");
    } else {
      var id = req.params.id;
      User.destroy({ user_id: id }).exec(function(err) {
        if (err) {
          res.send(500, { error: "db err" });
        }

        res.redirect("/User");
      });
    }
  }
};
