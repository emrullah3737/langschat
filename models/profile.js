const mongoose = require('mongoose');
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
  phone: {
    type: Number,
    required: true,
  },
  photo: { type: mongoose.Schema.Types.ObjectId, ref: 'file', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
};

const schema = new Schema(model);

const config = {
  name: 'profile',
  schema,
  owner: {
    key: 'user',
  },
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

const Profile = new Model(config);

module.exports = Profile;
