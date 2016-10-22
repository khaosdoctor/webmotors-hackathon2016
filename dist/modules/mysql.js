'use strict';

var mysql = require('mysql');
var log = require('./log.js');
var parser = require('body-parser');
var connection = mysql.createConnection({
  host: 'wm-hackathon-3.cyplqvjvmg0f.us-east-1.rds.amazonaws.com',
  user: 'hackathon',
  password: 'hackathon',
  database: 'wmhackathon'
});

module.exports = function (app) {
  app.use(parser.json());

  app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8088');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
  });

  app.post('/mysql', function (r, rs) {
    var query = r.body.query ? r.body.query.toString() : null;
    var resp = {};

    if (query) {
      log.info("New query received: " + query);
      connection.query(query, function (err, rows, fields) {
        log.info("Running query");
        if (err) {
          resp.status = 400;
          resp.message = err;
        } else {
          resp.status = 200;
          resp.message = rows;
        }

        rs.status(resp.status).json(resp.message);
        log.info("Query has been ran");
      });
    } else {
      rs.status(400).json("The query is empty");
    }
  });
};