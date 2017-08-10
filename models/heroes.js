const mongoose = require('mongoose');
const express = require('express');
const Model = require('../config/model');
const configs = require('../config/config');

const router = express.Router();

const config = {
  name: 'heroes',
  model: {
    name: {
      type: String,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
  },
};
const heroes = new Model(config);

module.exports = heroes;
