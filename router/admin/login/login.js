const router = require('express').Router();

const isLogged = (req, res, next) => {
  if (req.session && req.session.mail && req.session.password) {
    return res.redirect('/admin/index');
  }
  next();
};

router.use('/login', isLogged, (req, res) => {
  res.render('admin/login');
});

module.exports = router;
