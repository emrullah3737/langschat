const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const Login = require('./admin/middlewares/login');

// PAGES
const IndexPage = require('./admin/index/index');
const LoginPage = require('./admin/login/login');
const Pages = require('./admin/pages/view');

const app = express();
const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
  }),
);

router.use('/', Login);
// PAGES
router.use('/', IndexPage);
router.use('/', LoginPage);
router.use('/', Pages);

module.exports = router;
