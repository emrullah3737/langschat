const express = require('express');
const mongoose = require('mongoose');
const Model = require('../config/model');
const configs = require('../config/config');

const router = express.Router();
const Schema = mongoose.Schema;

const model = {
  name: {
    type: String,
    required: true,
  },
  file: {
    file: true,
    type: String,
    required: false,
  },
};
const schema = new Schema(model);

const config = {
  name: 'file',
  schema,
};

schema.pre('save', function (next) {
  const self = this;
  if (self.isNew) {
    console.log(self);
  }
  next();
});


const File = new Model(config);

module.exports = File;
