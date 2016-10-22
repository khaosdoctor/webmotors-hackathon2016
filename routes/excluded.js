// Exports all methods which are not allowed in the requisition

let send_invalid = function (rs) {
  rs.sendStatus(405);
}

module.exports = (app) => {
  app.get('/', (r, rs) => {
    send_invalid(rs);
  });
  app.post('/', (r, rs) => {
    send_invalid(rs);
  });
  app.put('/', (r, rs) => {
    send_invalid(rs);
  });
  app.delete('/', (r, rs) => {
    send_invalid(rs);
  });

  app.patch('/', (r, rs) => {
    send_invalid(rs);
  });

  app.put('/ger', (r, rs) => {
    send_invalid(rs);
  })
};