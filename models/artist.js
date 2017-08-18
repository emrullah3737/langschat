const mongoose = require('mongoose');
const express = require('express');
const Model = require('../config/model');

const Schema = mongoose.Schema;

const model = {
  _slug: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  photo: { type: mongoose.Schema.Types.ObjectId, ref: 'file', required: true },
};

const schema = new Schema(model);

const config = {
  name: 'artist',
  schema,
  protect: {
    post: true,
    get: false,
    put: true,
    delete: true,
  },
};

schema.pre('save', function (next) {
  const self = this;
  if (!self._slug) self._slug = self.name;
  next();
});

const Artist = new Model(config);

module.exports = Artist;
