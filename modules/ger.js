let moment = require('moment');
let g = require('ger');
let esm = g.MemESM();
let ger = g.GER(esm);

const getEvents = (namespace, redis) => {
    redis.lrange('events:'+namespace, 0, -1, (err, res) => {
      return res.map(JSON.parse);
  })
};

module.exports = {
  init: (redis) => {
    ger.initialize_namespace('carros')
      .then(() => {
        return ger.events(getEvents('carros', redis))
      })
      .then(
        () => {
            ger.initialize_namespace('motos')
              .then(() => {
                return ger.events(getEvents('motos', redis));
              });
          }
      );
  },
  addEvent: (namespace, person, action, thing) => {
    let d = new Date();
    let expire_date = moment(d).add(1, 'months').format('YYYY-MM-DD');
    return ger.events([{
      namespace: namespace,
      person: person,
      action: action,
      thing: thing,
      expires_at: expire_date
    }]);
  },
  getRecomendations: (namespace, person) => {
    return ger.recomendations_for_person(namespace, person, {actions: {'clicks': 1}, time_until_expiry: 2592000, filter_previous_actions: ["clicks"]});
  }
};


