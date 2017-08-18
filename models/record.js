const mongoose = require('mongoose');
const Model = require('../config/model');

const Schema = mongoose.Schema;

const model = {
  artist: { type: mongoose.Schema.Types.ObjectId, ref: 'artist', required: true },
  file: { type: mongoose.Schema.Types.ObjectId, ref: 'file', required: true },
};

const schema = new Schema(model);

const config = {
  name: 'record',
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
  next();
});

const Record = new Model(config);

module.exports = Record;
