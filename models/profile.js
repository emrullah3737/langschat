const mongoose = require('mongoose');
const express = require('express');
const Model = require('../config/model');
const configs = require('../config/config');

const router = express.Router();

const config = {
  name: 'profile',
  model: {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  },
};
const Profile = new Model(config);

module.exports = Profile;
