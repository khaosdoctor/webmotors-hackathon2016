let moment = require('moment');
let now = moment().format('DD/MM/YYYY hh:mm:ss a');
module.exports = {
  error: (t) => { console.error('['+ now + '] => '+ t); },
  info: (t) => { console.info('['+ now + '] => '+ t); },
  warning: (t) => { console.warn('['+ now + '] => '+ t); }
}