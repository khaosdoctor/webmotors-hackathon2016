let info = require('./package.json'); // Gets repo information and env variables
let exclude = require('./routes/excluded.js'); //Excluded (405) methods
let params = require('./routes/params.js'); // Param treatment
let mysql_listener = require('./modules/mysql.js'); // MySQL Queries
let log = require('./modules/log.js'); //Log Library
let cors = require('./modules/cors.js'); //CORS MODULE
let ger = require('./modules/ger.js');
let app = require('express')();
let redis = require('redis').createClient({host: info.redis.host, port: info.redis.port});

// Treating methods which are not allowed to happen
exclude(app);

// Parameter treatment
params(app);

//MySQL Queries
mysql_listener(app);

app.use(cors); //Removes CORS

// List of allowed methods
app.get('/:fingerprint/:namespace', (r, rs) => {
  rs.json(ger.getRecomendations(r.namespace, r.fingerprint));
});

// Redis is connected, we can start listening on ports
redis.on('connect', () => {
  log.info("Redis connected");
  ger.init(redis);
  app.listen(8088, function () { log.info('Listening on port 8088'); });
  let obj = {
    namespace: 'carros',
    person: 'bob',
    action: 'likes',
    thing: 'xmen',
    expires_at: '2020-06-06'
  };
  for (var i = 0; i < 100; i++) {
    redis.rpush("events:carros", JSON.stringify(obj), (e, r) => {});
  }
});

// Redis Error
redis.on('error', (err) => {
  log.error("Error: " + err);
});