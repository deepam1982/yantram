var http = require('http')
,	httpProxy = require('http-proxy')
,	express = require('express')
,	jwt = require('jsonwebtoken')
,	expressJwt = require('express-jwt')
,	secret = "top secret!!"
,	app = express()
;

app.use('/api/v1/', expressJwt({
	secret: secret,
	getToken: function fromHeaderOrQuerystring (req) {
		console.log('getToken called !!!')
		if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
			return req.headers.authorization.split(' ')[1];
		} else if (req.query && req.query.token) {
			return req.query.token;
		}
		return null;
	}
}));
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.send(401, 'You are not authorized!!');
  }
});


app.get('/auth/apiv1/getjwt', function (req, res) {
  //validate req.body.username and req.body.password
  //if is invalid, return 401
  var profile = {
    userId: 12
  };

  var token = jwt.sign(profile, secret, {
    expiresInMinutes: 60*1
  });

  res.json({
    token: token
  });
});


app.get('/api/v1/restricted', function (req, res) {
  console.log('user ' + req.user.userId + ' is calling /api/restricted');
  res.json({
    name: 'foo',
    user: req.user
  });
});

var apiRoutes = require(__rootPath + '/routes/apiV1');
apiRoutes(app);


jwtServer = http.createServer(app).listen(8080, function () {
  console.log('listening on http://localhost:8080');
});

module.exports = jwtServer;
