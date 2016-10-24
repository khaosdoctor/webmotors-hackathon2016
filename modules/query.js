let mysql = require('mysql');
let log = require('./log.js');
let connection = mysql.createConnection({
  host     : 'mysqlhost',
  user     : 'hackathon',
  password : 'hackathon',
  database : 'wmhackathon'
});

module.exports = (query, cb) => {
  query = (!query) ? false : query;

  if (query) {
    connection.query(query, (err, rows, fields) => {
      log.info("Running: " + query);
      if (err) {
        return false;
      }
      cb(rows);
    })
  }
};
