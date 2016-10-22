'use strict';

var info = require('./package.json'); // Gets repo information and env variables
var exclude = require('./routes/excluded.js'); //Excluded (405) methods
var params = require('./routes/params.js'); // Param treatment
var mysql_listener = require('./modules/mysql.js'); // MySQL Queries
var log = require('./modules/log.js'); //Log Library
var app = require('express')();
var redis = require('redis').createClient({ host: info.redis.host, port: info.redis.port });

// Treating methods which are not allowed to happen
exclude(app);

// Parameter treatment
params(app);

//MySQL Queries
mysql_listener(app);

// List of allowed methods
app.get('/:fingerprint', function (r, rs) {
  rs.send(r.fingerprint);
});

// Redis is connected, we can start listening on ports
redis.on('connect', function () {
  log.info("Redis connected");
  app.listen(8088, function () {
    log.info('Listening on port 8088');
  });
});

// Redis Error
redis.on('error', function (err) {
  log.error("Error: " + err);
});