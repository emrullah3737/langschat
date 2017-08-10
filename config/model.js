const mongoose = require('mongoose');
const config = require('./config');
const router = require('express').Router();

module.exports = class Mongo {
  constructor({ name = 'modelName', model = {} }) {
    this.model({ name, model });
    this.setRouter(name);
  }

  model({ name = 'modelName', model = {} }) {
    const schema = mongoose.Schema(model);
    const Model = mongoose.model(name, schema);
    this.Model = Model;
    return Model;
  }

  setRouter(name) {
    const api = name.toLowerCase();
    this.router = {
      api: `/${api}/:id*?`,
      cb: (req, res) => {
        if (req.method === 'GET') this.getData(req, res);
        if (req.method === 'POST') this.postData(req, res);
        if (req.method === 'PUT') this.putData(req, res);
        if (req.method === 'DELETE') this.deleteData(req, res);
      },
    };
  }

  getData(req, res) {
    if (this.headerController(req) === false) return this.status403(req, res);
    let limit = 10;
    let sort = '';
    let populate = '';
    if (req.query) {
      limit = parseInt(req.query.l, 10) || parseInt(req.query.limit, 10) || 10;
      sort = req.query.s || req.query.sort || '';
      populate = req.query.p || req.query.populate || '';
    }

    const cond = {};
    if (req.params.id !== undefined) cond._id = req.params.id;

    this.Model.find(cond, (err, data) => {
      if (!err && data.length > 0) this.status200(req, res, data);
      else this.status404(req, res, err);
    }).populate(populate).sort(sort).limit(limit);
  }

  postData(req, res) {
    if (this.headerController(req) === false) return this.status403(req, res);
    const model = new this.Model(req.body);
    model.save((err, data) => {
      if (!err) this.status200(req, res, data);
      else this.status403(req, res, err);
    });
  }

  putData(req, res) {
    if (this.headerController(req) === false) return this.status403(req, res);
    if (req.params.id !== undefined) {
      this.Model.update(
        { _id: req.params.id },
        { $set: req.body },
        (err, data) => {
          const obj = {
            data,
            body: req.body,
          };
          if (err) this.status403(req, res, err);
          else this.status200(req, res, obj);
        });
    } else this.specErr(req, res);
  }

  deleteData(req, res) {
    if (this.headerController(req) === false) return this.status403(req, res);
    if (req.params.id !== undefined) {
      this.Model.remove({ _id: req.params.id }, (err, data) => {
        if (!err) this.status200(req, res, { data, id: req.params.id });
        else this.status404(req, res, err);
      });
    } else this.specErr(req, res);
  }

  status404(req, res, err) {
    console.log(err);
    if (err) res.status(404).json({ error: err.name, message: err.message, status: 404 });
    else res.status(404).json({ error: 'NotFound', message: 'Data Not Found', status: 404 });
  }

  status403(req, res, err) {
    console.log(err);
    if (err) res.status(403).json({ error: err.name, message: err.message, status: 403 });
    else res.status(403).json({ error: 'Unauthorized', message: 'Unauthorized zone', status: 403 });
  }

  status200(req, res, data) {
    res.status(200).json({ data, status: 200 });
  }

  specErr(req, res) {
    res.status(400).json({ err: 'ValidationError', message: 'id is undefined', meta: 404 });
  }

  headerController(req) {
    const Id = config.getData('X-Client-Id');
    const Secret = config.getData('X-Client-Secret');
    const ClientId = req.get('X-Client-Id');
    const ClientSecret = req.get('X-Client-Secret');
    if (Id !== ClientId || Secret !== ClientSecret) return false;
    return true;
  }
};
