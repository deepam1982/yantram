var http = require('http')
,	httpProxy = require('http-proxy')
,	express = require('express')
,	bodyParser = require('body-parser')
,	cookieParser = require('cookie-parser')
,	session      = require('express-session')
,	app = express()
,	passport = require('passport')
,	LocalStrategy = require('passport-local').Strategy;

app.use(cookieParser());
app.use(bodyParser());
app.use(session({secret: 'inoho cat', name: 'sid'}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(function(username, password, done) {
	console.log("Passport Local Strategy called", username, password);
	if(__userConfig.get('email') == username && __userConfig.get('password') == password)
		return done(null, __userConfig.toJSON());
	console.log("Incorrect username or password.");
	return done(null, false, { message: 'Incorrect username or password.' });		
}));


passport.serializeUser(function(user, done) {
  done(null, user.email);
});

passport.deserializeUser(function(id, done) {
    done(null, __userConfig.toJSON());
});



//
// Create a proxy server with custom application logic
//
var proxy = httpProxy.createProxyServer({});

//
// Create your custom server and just call `proxy.web()` to proxy
// a web request to the target passed in the options
// also you can use `proxy.ws()` to proxy a websockets request
//
// var authServer = http.createServer(function(req, res) {
//   // You can define here your custom logic to handle the request
//   // and then proxy the request.
//   proxy.web(req, res, {target:'ws://localhost:80',ws: true});
// });
var authServer = http.createServer(app);

app.use('/static', express.static(__rootPath + '/static'));
app.get('/auth/login', function(req, res) {
	try {res.sendFile(__rootPath + '/static/htmls/auth/login.html');}
	catch(err) {res.sendfile(__rootPath + '/static/htmls/auth/login.html');}
});
app.post('/auth/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/auth/' }));

app.all('/*', function (req, res, next) {
	if (req.isAuthenticated()) return proxy.web(req, res, {target:'http://localhost:80'});
	res.redirect('/auth/login');
});
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});


console.log("listening on port 8123")
authServer.listen(8123);
module.exports = authServer;