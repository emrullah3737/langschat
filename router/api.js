const express = require('express');
const bodyParser = require('body-parser');
const _ = require('underscore');
const config = require('../config/config');

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
// Api Pages
const Pages = {};
_.each(config.getModel(), (el, key) => {
  const page = require(`../models/${el}`);
  router.use(page.router.api, page.router.cb);
});

module.exports = router;
