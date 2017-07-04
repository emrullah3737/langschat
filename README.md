## Emochu.io

- $ git clone ```https://github.com/emrullah3737/emochu.io.git```
- $ npm install
- $ node app

## Create Model

At the ```Models``` folder u can create mongoose model 

```javascript
const mongoose = require('mongoose');
const express = require('express');
const Model = require('../config/model');
const configs = require('../config/config');

const router = express.Router();

const config = {
  name: 'user',
  model: {
    mail: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    created_at: {
      type: Date,
      required: true,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      required: false,
      default: Date.now,
    },
    role: {
      type: String,
      enum: ['SuperAdmin', 'Admin', 'User', 'Guest'],
      default: 'User',
    },
  },
};
const User = new Model(config);
// SuperAdmin
const adminData = configs.getAdmin();
User.Model.findOneAndUpdate(
  adminData,
  adminData,
  { upsert: true },
  (err, res) => {},
);

module.exports = User;
```

## Setting Model

At the ```configuration.json``` file u must add model name

```javascript
"models": [
  "user",
  "profile"
]
```
