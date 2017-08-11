const mongoose = require('mongoose');
const express = require('express');
const Model = require('../config/model');
const configs = require('../config/config');

const router = express.Router();

const config = {
  name: 'user',
  model: {
    mail: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    created_at: {
      type: Date,
      required: true,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      required: false,
      default: Date.now,
    },
    role: {
      type: String,
      enum: ['SuperAdmin', 'Admin', 'User', 'Guest'],
      default: 'User',
    },
  },
};
const User = new Model(config);
// SuperAdmin
const adminData = configs.getAdmin();
User.Model.findOneAndUpdate(
  adminData,
  adminData,
  { upsert: true },
  (err, res) => {
    console.log('Super Admin');
    console.log(res);
  });

module.exports = User;
