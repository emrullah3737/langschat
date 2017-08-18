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
  if (!self._slug) self._slug = self.name;
  next();
});


const File = new Model(config);

module.exports = File;
