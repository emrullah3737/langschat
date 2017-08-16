const headers = require('../../config/headers');
const mongoose = require('mongoose');
const express = require('express');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');

const router = express.Router();

const headerCtrl = (req, res, next) => {
  if (headers.headerController(req) === false) return headers.status403(req, res);
  next();
};

const isExistUser = (req, cb) => {
  const condition = {
    mail: req.body.mail,
    password: req.body.password,
  };

  User.Model.findOne(condition, (err, response) => {
    if (err) return cb(err, null);
    if (response) {
      const jwtObj = {
        _id: response._id,
        mail: response.mail,
      };
      const token = jwt.sign(jwtObj, 'secret', { expiresIn: '1h' });
      const obj = {
        _id: response._id,
        token,
        mail: response.mail,
      };
      return cb(null, obj);
    }
    return cb({ err: 'User not exist' }, null);
  });
};

router.post('/', headerCtrl, (req, res) => {
  isExistUser(req, (err, response) => {
    if (err) return res.send(err);
    res.json(response);
  });
});

module.exports = router;
