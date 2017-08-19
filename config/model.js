const mongoose = require('mongoose');
const _ = require('underscore');
const config = require('./config');
const jwt = require('jsonwebtoken');
const router = require('express').Router();

module.exports = class Mongo {
  constructor(opt = { name: 'modelName', schema: {} }) {
    const name = opt.name;
    const schema = opt.schema;
    this.Schema = schema;
    this.protect = opt.protect ? opt.protect : undefined;// protect requests
    this.owner = opt.owner ? opt.owner : undefined;// owner id (for token)
    this.mask = opt.mask ? opt.mask : undefined;// masking fields
    this.model({ name, schema });
    this.setRouter(name);
  }

  model({ name = 'modelName', schema = {} }) {
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

  find(req, res, cond, populate, sort, limit) {
    this.Model.find(cond, (err, data) => {
      if (this.mask) {
        _.mapObject(data, (e, i) => {
          const deepData = e;
          _.each(this.mask, (de, di) => {
            if (de) deepData[di] = undefined;
          });
          return deepData;
        });
      }
      if (!err && data.length > 0) this.status200(req, res, data);
      else this.status404(req, res, err);
    }).populate(populate).sort(sort).limit(limit);
  }

  populate(populate) {
    populate = populate.split(',');
    _.each(populate, (e, i) => {
      const deepPopulate = e.split('.');
      if (deepPopulate.length) {
        populate[i] = this.deepPopulate({}, deepPopulate);
      }
    });
    return populate;
  }

  deepPopulate(obje, n) {
    let populate;
    if (!obje.path) populate = '';
    else populate = obje;
    if (n.length === 1) return { path: n[0], populate };
    const obj = {
      path: n[n.length - 1],
      populate,
    };
    n.pop();
    return this.deepPopulate(obj, n);
  }


  getData(req, res) {
    if (this.protect && this.protect.get) return this.status403(req, res);
    if (this.headerController(req) === false) return this.status403(req, res);

    let limit = 10;
    let sort = '';
    let populate = '';
    const cond = {};
    if (req.params.id !== undefined) cond._id = req.params.id;

    if (req.query) {
      limit = parseInt(req.query.l, 10) || parseInt(req.query.limit, 10) || 10;
      sort = req.query.s || req.query.sort || '';
      populate = req.query.p || req.query.populate || '';
      populate = this.populate(populate);
      if (req.query.where) {
        const where = req.query.where;
        const whereArr = where.split(',');
        _.each(whereArr, (e, i) => {
          const objArr = e.split(':');
          cond[objArr[0]] = objArr[1];
        });
      }
    }

    return this.token(req, (error, decode) => {
      if (this.owner && !error) {
        if (this.owner.key) cond[this.owner.key] = decode._id;
      } else if (this.owner && error) return this.status403(req, res);
      this.find(req, res, cond, populate, sort, limit);
    });
  }

  postData(req, res) {
    if (this.protect && this.protect.post) return this.status403(req, res);
    if (this.headerController(req) === false) return this.status403(req, res);
    const model = new this.Model(req.body);
    model.save((err, data) => {
      if (!err) this.status200(req, res, data);
      else this.status403(req, res, err);
    });
  }

  putData(req, res) {
    if (this.protect && this.protect.put) return this.status403(req, res);
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
    if (this.protect && this.protect.delete) return this.status403(req, res);
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

  token(req, cb) {
    const ClientToken = req.get('X-Client-Token') || '';
    jwt.verify(ClientToken, 'secret', (err, decode) => {
      if (err) return cb(true, null);
      return cb(null, decode);
    });
  }

  headerController(req) {
    const Id = config.getData('X-Client-Id');
    const Secret = config.getData('X-Client-Secret');
    const ClientId = req.get('X-Client-Id');
    const ClientSecret = req.get('X-Client-Secret');
    if ((Id !== '' && Secret !== '') && (Id !== ClientId || Secret !== ClientSecret)) return false;
    return true;
  }
};
