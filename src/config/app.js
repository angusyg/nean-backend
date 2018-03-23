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
