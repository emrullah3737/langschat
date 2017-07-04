const mongoose = require('mongoose');
const router = require('express').Router();

mongoose.Promise = global.Promise;

class Mongo {
  constructor() {
    this.dbName = '';
  }

  connect(dbName) {
    this.dbName = dbName;
    mongoose.connect(`mongodb://localhost/${dbName}`);
    this.connection();
  }

  connection() {
    const db = mongoose.connection;
    db.on('error', () => console.error('connection error:'));
    db.on('open', () => console.log('connection succed!'));
  }
}

module.exports = new Mongo();
