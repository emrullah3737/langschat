const router = require('express').Router();
const _ = require('underscore');

const Controller = require('./controller');
const auth = require('../middlewares/auth');
const config = require('../../../config/config');
const upload = require('../../../config/upload');

_.each(config.getModel(), (el, key) => {
  const User = require(`../../../models/${el}`);

  const users = (req, res, next) => {
    User.Model.find({}, (err, data) => {
      if (data.length > 0) req.users = data;
      else req.users = [];
      next();
    });
  };

  const inputs = (req, res, next) => {
    let select;
    const file = [];
    if (User.Model.schema.path('role')) {
      select = User.Model.schema.path('role').enumValues;
      const index = select.indexOf('SuperAdmin');
      if (index >= 0) {
        select.splice(index, 1);
      }
    }
    const fieldObj = [];
    const fields = User.Model.schema.eachPath((fld, types) => {
      const field = types.path;
      const type = types.instance;
      let enums;
      if (types.enumValues && types.enumValues.length > 0) { enums = types.enumValues; }
      if (
        field !== '_id' &&
        field !== '__v' &&
        field !== 'updated_at' &&
        field !== 'created_at'
      ) {
        let ref;
        if (types.options && types.options.file) {
          file.push({
            field: fld,
          });
        } else if (types.options && types.options.ref) {
          const referance = types.options.ref;
          const model = require(`../../../models/${referance}`);
          model.Model.find({}, (error, response) => {
            ref = { referance, response };
            fieldObj.push({ field, type, enums, ref });
          });
        } else {
          fieldObj.push({ field, type, enums, ref });
        }
      }
    });
    req.select = select;
    req.fieldObj = fieldObj;
    req.file = file;
    next();
  };

  router.use(`/${el}/:id*?`, inputs, auth, users, (req, res) => {
    req.users.el = el;
    const select = req.select;
    const fileArr = req.file;
    const fieldObj = req.fieldObj;
    const objList = {
      session: req.session,
      users: req.users,
      select,
      fieldObj,
      el,
      pages: config.getModel(),
      fileArr,
    };
    let valueObj;

    if (req.params.id) {
      User.Model.findOne({ _id: req.params.id }, (err, data) => {
        if (data) {
          valueObj = data;
          const objEdit = {
            session: req.session,
            data: {
              fieldObj,
              valueObj,
              el,
              pages: config.getModel(),
              fileArr,
            },
          };
          console.log(fileArr);
          res.render('admin/page/edit', objEdit);
        }
      });
    } else res.render('admin/page/list', objList);
  });

  const mdl = (req, res, next) => {
    req.mdl = el;
    next();
  };

  router.post(`/add${el}`, upload.single('file'), mdl, Controller.add, (req, res) => {
    if (req.isCreated === true) res.redirect(el);
    else res.redirect(`/admin/${el}`);
  });

  router.use(`/remove${el}`, mdl, Controller.remove, (req, res) => {
    if (req.isRemoved === true) res.redirect(el);
    else res.redirect(`/admin/${el}`);
  });

  router.use(`/update${el}`, mdl, Controller.update, (req, res) => {
    if (req.isUpdated === true) res.redirect(el);
    else res.redirect(`/admin/${el}`);
  });
});

module.exports = router;
