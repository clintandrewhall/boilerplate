var passport = require('passport')
  , core = require('./../core')()
  , config = core.getConfig().auth
  , logger = core.getLogger('auth');

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

function addFacebookAuth(app) {
  var FacebookStrategy = require('passport-facebook').Strategy;

  passport.use(
    new FacebookStrategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL,
        passReqToCallback: true
      },
      function(req, accessToken, refreshToken, profile, done) {
        if (!req.user) {
          // Not logged-in. Authenticate based on Facebook account.
          return done(null, profile);
        } else {
          // Logged in. Associate Twitter account with user.  Preserve the login
          // state by supplying the existing user after association.
          return done(null, req.user);
        }
      })
  );

  // Redirect the user to Facebook for authentication.  When complete,
  // Facebook will redirect the user back to the application at
  //     /auth/facebook/callback
  app.get('/auth/facebook', passport.authenticate('facebook'));

  // Facebook will redirect the user to this URL after approval.  Finish the
  // authentication process by attempting to obtain an access token.  If
  // access was granted, the user will be logged in.  Otherwise,
  // authentication has failed.
  app.get('/auth/facebook/callback',
    passport.authenticate(
      'facebook',
      { successRedirect: '/', failureRedirect: '/auth' }
    )
  );
}

function addTwitterAuth(app) {
  var TwitterStrategy = require('passport-twitter').Strategy;

  passport.use(new TwitterStrategy({
      consumerKey: config.twitter.consumerKey,
      consumerSecret: config.twitter.consumerSecret,
      callbackURL: config.twitter.callbackURL,
      passReqToCallback: true
    },
    function(req, token, tokenSecret, profile, done) {
      if (!req.user) {
        // Not logged-in. Authenticate based on Twitter account.
        return done(null, profile);
      } else {
        // Logged in. Associate Twitter account with user.  Preserve the login
        // state by supplying the existing user after association.
        return done(null, req.user);
      }
    })
  );

  // Redirect the user to Twitter for authentication.  When complete, Twitter
  // will redirect the user back to the application at
  //   /auth/twitter/callback
  app.get('/auth/twitter', passport.authenticate('twitter'));

  // Twitter will redirect the user to this URL after approval.  Finish the
  // authentication process by attempting to obtain an access token.  If
  // access was granted, the user will be logged in.  Otherwise,
  // authentication has failed.
  app.get('/auth/twitter/callback',
    passport.authenticate(
      'twitter',
      { successRedirect: '/', failureRedirect: '/auth' }
    )
  );
}

function addGoogleAuth(app) {
  var GoogleStrategy = require('passport-google').Strategy;

  passport.use(new GoogleStrategy({
      returnURL: config.google.returnURL,
      realm: config.google.realm,
      passReqToCallback: true
    },
    function(req, identifier, profile, done) {
      if (!req.user) {
        // Not logged-in. Authenticate based on Google account.
        return done(null, profile);
      } else {
        // Logged in. Associate Twitter account with user.  Preserve the login
        // state by supplying the existing user after association.
        return done(null, req.user);
      }
    })
  );

  // Redirect the user to Google for authentication.  When complete, Google
  // will redirect the user back to the application at
  //     /auth/google/return
  app.get('/auth/google', passport.authenticate('google'));

  // Google will redirect the user to this URL after authentication.  Finish
  // the process by verifying the assertion.  If valid, the user will be
  // logged in.  Otherwise, authentication has failed.
  app.get('/auth/google/callback',
    passport.authenticate(
      'google',
      { successRedirect: '/', failureRedirect: '/auth' }
    )
  );
}

function addGithubAuth(app) {
  var GithubStrategy = require('passport-github').Strategy;

  passport.use(new GithubStrategy({
      clientID: config.github.clientID,
      clientSecret: config.github.clientSecret,
      callbackURL: config.github.callbackURL,
      passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {
      if (!req.user) {
        // Not logged-in. Authenticate based on Github account.
        return done(null, profile);
      } else {
        // Logged in. Associate Twitter account with user.  Preserve the login
        // state by supplying the existing user after association.
        return done(null, req.user);
      }
    })
  );

  // Redirect the user to Github for authentication.  When complete, Google
  // will redirect the user back to the application at
  //     /auth/github/return
  app.get('/auth/github', passport.authenticate('github'));

  // Github will redirect the user to this URL after authentication.  Finish
  // the process by verifying the assertion.  If valid, the user will be
  // logged in.  Otherwise, authentication has failed.
  app.get('/auth/github/callback',
    passport.authenticate(
      'github',
      { successRedirect: '/', failureRedirect: '/auth' }
    )
  );
}

function addAuthPage(app) {
  app.get('/auth', function(req, res){
    res.render('auth', { title: 'Authentication Settings' });
  });
}

function addAll(app) {
  addAuthPage(app);
  addFacebookAuth(app);
  addGithubAuth(app);
  addGoogleAuth(app);
  addTwitterAuth(app);
}

module.exports = {
  'addAll': addAll,
  'addAuthPage': addAuthPage,
  'addFacebookAuth' : addFacebookAuth,
  'addGithubAuth' : addGithubAuth,
  'addGoogleAuth' : addGoogleAuth,
  'addTwitterAuth' : addTwitterAuth
};
