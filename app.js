
var core = require('./core')()
  , express = require('express')
  , http = require('http')
  , nib = require('nib')
  , path = require('path')
  , stylus = require('stylus')
  , passport = require('passport')
  , routes = require('./routes')
  , user = require('./routes/user')
  , auth = require('./routes/auth');

var app = express()
  , logger = core.getLogger('main')
  , public_dir = path.join(__dirname, 'public');

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .set('compress', true)
    .use(nib());
}

// all environments
app.set('port', (process.env.PORT || 3000));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.configure(function() {
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('m0v3f@st'));
  app.use(express.session());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(stylus.middleware({
    'src': public_dir,
    'compile': compile
  }));
  app.use(express.static(public_dir));
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//auth.addAll(app);
app.use('/', routes.index);
app.use('/users', user.list);
auth.addAll(app);

http.createServer(app).listen(app.get('port'), function(){
  logger.info('Express server listening on port ' + app.get('port'));
});
