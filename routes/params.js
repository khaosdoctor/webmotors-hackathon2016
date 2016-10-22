module.exports = (app) => {
  app.param('fingerprint', (r, rs, next) => {
    r.fingerprint = r.params.fingerprint;
    next();
  });
  
  app.param('namespace', (r, rs, next) => {
    r.namespace = r.params.namespace;
    next();
  });

  app.param('gerObject', (r, rs, next) => {
    r.gerObject = r.params.gerObject;
    next();
  })
};