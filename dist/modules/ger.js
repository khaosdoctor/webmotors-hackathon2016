'use strict';

module.exports = function (app, redis) {
  var g = require('ger');
  var esm = ger.MemESM();
  var ger = g.GER(esm);

  ger.initialize_namespace('carros').then(function () {
    return ger.events(getEvents('carros'));
  });

  ger.initialize_namespace('motos').then(function () {
    return ger.events(getEvents('motos'));
  });
}();