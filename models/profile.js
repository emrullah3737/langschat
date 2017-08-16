const mongoose = require('mongoose');
const express = require('express');
const Model = require('../config/model');
const configs = require('../config/config');

const router = express.Router();
const Schema = mongoose.Schema;

const model = {
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
};

const schema = new Schema(model);

const config = {
  name: 'profile',
  schema,
};
const Profile = new Model(config);

module.exports = Profile;
