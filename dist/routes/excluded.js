'use strict';

// Exports all methods which are not allowed in the requisition

var send_invalid = function send_invalid(rs) {
  rs.sendStatus(405);
};

module.exports = function (app) {
  app.get('/', function (r, rs) {
    send_invalid(rs);
  });
  app.post('/', function (r, rs) {
    send_invalid(rs);
  });
  app.put('/', function (r, rs) {
    send_invalid(rs);
  });
  app.delete('/', function (r, rs) {
    send_invalid(rs);
  });

  app.patch('/', function (r, rs) {
    send_invalid(rs);
  });

  app.put('/ger', function (r, rs) {
    send_invalid(rs);
  });
};