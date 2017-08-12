const mongoose = require('mongoose');
const router = require('express').Router();
const config = require('./config');

mongoose.Promise = global.Promise;

class Mongo {
  constructor() {
    this.dbName = '';
  }

  connect(dbName) {
    this.dbName = dbName;
    const host = config.getDbOptions().host || '';
    const user = config.getDbOptions().user || '';
    const password = config.getDbOptions().password || '';

    mongoose.connect(`mongodb://${user}:${password}@${host}/${dbName}`);
    this.connection();
  }

  connection() {
    const db = mongoose.connection;
    db.on('error', () => console.error('connection error:'));
    db.on('open', () => console.log('connection succed!'));
  }
}

module.exports = new Mongo();
