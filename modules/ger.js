let moment = require('moment');


module.exports = {
  //Adds new events to the list
  addEvent: (redis, namespace, person, thing) => {
    let d = new Date();
    let event = {
      namespace: namespace,
      person: person,
      action: 'clicks',
      thing: thing,
      expires_at: moment(d).add(1, 'months').format('YYYY-MM-DD')
    };
    return redis.rpush("events:" + namespace, JSON.stringify(event), (err, res) => {
      if (err) {
        console.error(err);
        return err;
      }
      return true;
    });
  },
  getRecommendations: (ger, events, namespace, person) => {
    return ger.initialize_namespace('carros')
      .then(() => {
        return ger.events(events);
      })
      .then(() => {
        // What things might alice like?
        return ger.recommendations_for_person('carros', 'alice', { actions: { clicks: 1 } , time_until_expiry: 2592000, filter_previous_actions: ["clicks"]})
      })
      .then((recommendations) => {
          return recommendations.recommendations;
      });
  }
};


