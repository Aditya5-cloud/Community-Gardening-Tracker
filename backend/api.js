// Vercel entry point: adapt Express app to a simple handler
const app = require('./server');

// Express app is a function (req, res) so we can export a handler that invokes it.
module.exports = (req, res) => {
  return app(req, res);
};
