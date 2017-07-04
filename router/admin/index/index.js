const router = require('express').Router();
const mongoose = require('mongoose');
const _ = require('underscore');
const User = require('../../../models/user');
const Profile = require('../../../models/profile');
const auth = require('../middlewares/auth');
const config = require('../../../config/config');

const users = (req, res, next) => {
  User.Model.find({}, (err, data) => {
    if (data.length > 0) req.users = data;
    else req.users = [];
    next();
  });
};

const profiles = (req, res, next) => {
  Profile.Model
    .find({}, (err, data) => {
      if (data.length > 0) req.profiles = data;
      else req.profiles = [];
      next();
    })
    .populate('user');
};

const radarData = (req, res, next) => {
  let strData = '[';
  let strLabel = '[';
  let count1 = 1;
  _.each(mongoose.models, (el, key) => {
    count1 += 1;
  });
  let count2 = 1;
  _.each(mongoose.models, (el, key) => {
    el.count((err, data) => {
      count2 += 1;
      strLabel += `"${key}", `;
      strData += `${data}, `;
      if (count1 === count2) {
        strData += ']';
        strLabel += ']';
        req.radarData = strData;
        req.radatLabel = strLabel;
        next();
      }
    });
  });
};

router.use('/index', auth, users, profiles, radarData, (req, res) => {
  const obj = {
    session: req.session,
    users: req.users,
    profiles: req.profiles,
    pages: config.getModel(),
    dataRadar: req.radarData,
    labelRadar: req.radatLabel,
  };
  res.render('admin/index', obj);
});

module.exports = router;
