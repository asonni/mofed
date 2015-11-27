var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  easyPbkdf2 = require("easy-pbkdf2")();
var User = require("../models/user");

//read the passport api docs if you wanna know what this does
passport.use(new LocalStrategy(
  function (username, password, done) {
    findByUserName(username, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      authenticate(user, password, function (valid) {
        if (valid) {

          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    });
  }
));

//read the passport api docs if you wanna know what this does
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

//read the passport api docs if you wanna know what this does
passport.deserializeUser(function (id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});

// app.post('/login',
//   passport.authenticate('local', { successRedirect: '/',
//                                    failureRedirect: '/login' }));

// router.post('/user/login', function(req, res, next) {
//   passport.authenticate('local', function(err, user, info) {
//     if (err) { return next(err); }
//     if (!user) { return res.redirect('/login'); }
//     req.logIn(user, function(err) {
//       if (err) { return next(err); }
//       return res.redirect('/users/' + user.username);
//     });
//   })(req, res, next);
// });

module.exports = function (router) {
  router.post('/user/login', function(req, res, next) {
    console.log(req.body);
    passport.authenticate('local', function(err, user) {
      if (err) { return next(err); }
      if (!user) { return res.send({login: 2 }); }
      if(!user.activated){
        req.session.destroy();
        res.send({login:3});
      }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        res.send({login: true });
      });
    })(req, res, next);
  });
  //login here we get the email and password and check if they're conrrect
  // router.post('/user/login', passport.authenticate('local', {
  //   failureRedirect: '/?msg=2'
  // }), function (req, res) {
  //   findById(req.session.passport.user, function (err, user) {
  //     if(user.activated) {
  //       req.session.idu = user.id;
  //       req.session.name = user.name;
  //       res.send({login: true });
  //     } else {
  //       req.session.destroy();
  //       res.send({login:3});
  //     }
  //   });
  // });
  // here if a user wants to logout of the app
  router.get('/user/logout', ensureAuthenticated, function (req, res) {
    req.session.destroy();
    res.redirect('/');
  });
  return router;
}

function findById(id, fn) {
  User.findOne({_id : id}, function(err, user){
    if (user) {
      fn(null, user);
    } else {
      fn(new Error('User ' + id + ' does not exist'));
    }
  });
}

function findByUserName(username, fn) {
  User.findOne({email : username}, function(err, user){
    if (user) {
      return fn(null, user);
    } else {
      return fn(null, null);
    }
  });
}

function authenticate(user, userEnteredPassword, callback) {
  // make sure the user-entered password is equal to the previously
  // created hash when hashed with the same salt.
  easyPbkdf2.verify(user.salt, user.password, userEnteredPassword, function (err, valid) {
    if (err) {
      console.log(err);
    } else {
      callback(valid);
    }
  });
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/')
}
