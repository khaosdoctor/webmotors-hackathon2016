'use strict';

var nowD = new Date();
var now = pad(nowD.getDate(), 2) + '/' + pad(nowD.getMonth(), 2) + '/' + nowD.getFullYear() + ' ' + nowD.getHours() + ':' + nowD.getMinutes() + ':' + nowD.getSeconds();

function pad(value, length) {
  return value.toString().length < length ? pad("0" + value, length) : value;
}

module.exports = {
  error: function error(t) {
    console.error('[' + now + '] => ' + t);
  },
  info: function info(t) {
    console.info('[' + now + '] => ' + t);
  },
  warning: function warning(t) {
    console.warn('[' + now + '] => ' + t);
  }
};