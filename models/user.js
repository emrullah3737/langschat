const mongoose = require('mongoose');
const express = require('express');
const Model = require('../config/model');
const configs = require('../config/config');

const router = express.Router();
const Schema = mongoose.Schema;


const model = {
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
};
const schema = new Schema(model);

const config = {
  name: 'user',
  schema,
  protect: {
    post: true,
    get: false,
    put: true,
    delete: true,
  },
  owner: {
    key: '_id',
  },
  mask: {
    password: true,
    role: true,
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
    if (err) console.log(err);
    else console.log(res);
  });

module.exports = User;
