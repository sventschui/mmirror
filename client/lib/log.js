// @flow
const pino = require('pino');

const logger = pino({
  pretty: process.env.NODE_ENV !== 'production',
});

module.exports = logger;
