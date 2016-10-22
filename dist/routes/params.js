'use strict';

module.exports = function (app) {
  app.param('fingerprint', function (r, rs, next) {
    r.fingerprint = r.params.fingerprint;
    next();
  });

  app.param('gerObject', function (r, rs, next) {
    r.gerObject = r.params.gerObject;
    next();
  });
};