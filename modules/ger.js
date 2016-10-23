let moment = require('moment');

const getEvents = (namespace, redis, cb) => {
  
};

module.exports = {
  addEvent: (ger, namespace, person, action, thing) => {
    var d = new Date();
    let expire_date = moment(d).add(1, 'months').format('YYYY-MM-DD');
    return ger.events([{
      namespace: namespace,
      person: person,
      action: action,
      thing: thing,
      expires_at: expire_date
    }]);
  },
  getRecommendations: (ger, events, namespace, person) => {
     return ger.initialize_namespace('carros')
      .then(() => {
        return ger.events(events);
      })
      .then(() => {
        return ger.recommendations_for_person(namespace, person, { actions: { 'likes': 1 } });
      })
      .then((recommend) => {
        return (recommend)
       });
  }
};


