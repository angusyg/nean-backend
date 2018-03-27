/**
 * Express app configuration
 * @module config/app
 */

/**
 * Cross origin middleware configuration
 * @namespace crossOrigin
 * @property {function} origin          - Bcrypt salt factor for salt generation
 * @property {string[]} methods         - Cross origin middleware configuration
 * @property {string[]} allowedHeaders  - Cross origin middleware configuration
 * @property {boolean} credentials      - Cross origin middleware configuration
 * @property {number} maxAge            - Cross origin middleware configuration
 * @memberof configdd
 */
module.exports = {
  saltFactor: 10,
  crossOrigin: {
    origin(origin, callback) {
      const whitelistOrigins = [];
      if (whitelistOrigins.length === 0) callback(null, true);
      else if (whitelistOrigins.indexOf(origin) !== -1) callback(null, true);
      else callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['authorization', 'refresh'],
    credentials: true,
    maxAge: 600,
  },
};
