let info = require('./package.json'); // Gets repo information and env variables
let exclude = require('./routes/excluded.js'); //Excluded (405) methods
let params = require('./routes/params.js'); // Param treatment
let mysql_listener = require('./modules/mysql.js'); // MySQL Queries
let parser = require('body-parser');
let log = require('./modules/log.js'); //Log Library
let cors = require('./modules/cors.js'); //CORS MODULE
let ger_wrapper = require('./modules/ger.js'); //GER Wrapper
let app = require('express')();
let redis = require('redis').createClient({ host: info.redis.host, port: info.redis.port });

// Good Enough Recommendations
let g = require('ger');
let esm = new g.MemESM();
let ger = new g.GER(esm);

// Treating methods which are not allowed to happen
exclude(app);

// Parameter treatment
params(app);

//MySQL Queries
mysql_listener(app);

// List of allowed methods

// Gets recommendations
app.get('/:fingerprint/:namespace', (r, rs) => {
  redis.lrange('events:carros', 0, -1, (err, res) => {
    let events = res ? res.map(JSON.parse) : {};
    ger_wrapper.getRecommendations(ger, events, r.namespace, r.fingerprint)
      .then((rec) => {
        rs.json(rec);
      });
  });
});

//Adds new values
app.post("/:fingerprint", (r, rs) => {
  app.use(parser.json());
  app.use(cors);
  let result = ger_wrapper.addEvent(redis, "carros", r.fingerprint, r.body.value);
  if (result === true) {
    rs.status(201).json({fingerprint: r.fingerprint, value: r.body.value });
  }
  else {
    rs.status(400).json(result);
  }

});

// Redis is connected, we can start listening on ports
redis.on('connect', () => {
  log.info("Redis connected");
  app.listen(8088, function () { log.info('Listening on port 8088'); });
});

// Redis Error
redis.on('error', (err) => {
  log.error("Error: " + err);
});