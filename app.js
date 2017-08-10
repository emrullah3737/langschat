const config = require('./config/config');

config.init()
  .then(() => {
    const express = require('express');
    const cors = require('cors');
    const admin = require('./router/admin');
    const api = require('./router/api');
    const cfgMongo = require('./config/mongoose');
    const hbs = require('./config/hbsHelpers');

    const app = express();
    app.use(cors());
    app.use('/admin', admin);
    app.use('/api', api);
    app.use('/admin', express.static('public'));
    app.set('view engine', 'hbs');

    app.set('trust proxy', 1); // trust first proxy

    cfgMongo.connect(config.getAppName());

    app.listen(config.getData('port'));
  })
  .catch(console.log);
