let mysql = require('mysql');
const log = require('./log.js');
let cors = require('./cors.js');
let parser = require('body-parser');
let connection = mysql.createConnection({
  host     : 'wm-hackathon-3.cyplqvjvmg0f.us-east-1.rds.amazonaws.com',
  user     : 'hackathon',
  password : 'hackathon',
  database : 'wmhackathon'
});

module.exports = (app) => {
  app.use(parser.json());
  app.use(cors);

  app.post('/mysql', (r, rs) => {
    let query = r.body.query ? r.body.query.toString() : null;
    let resp = {};

    if (query) {
      log.info("New query received: " + query);
      connection.query(query, (err, rows, fields) => {
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
    }
    else {
      rs.status(400).json("The query is empty");
    }

  })
}