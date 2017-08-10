const mongoose = require('mongoose');
const express = require('express');
const Model = require('../config/model');
const configs = require('../config/config');

const router = express.Router();

const config = {
  name: 'students',
  model: {
    name: {
      type: String,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
  },
};
const students = new Model(config);

module.exports = students;
