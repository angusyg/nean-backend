const express = require('express');
const config = require('../config');
const logger = require('../helpers/logger').client;

const router = express.Router();

router.post('/:level', (req, res) => {
  logger[req.params.level](`[IP:${req.ip}] ${req.body.message}`);
  res.status(config.httpStatus.noContent).end();
});

module.exports = router;
