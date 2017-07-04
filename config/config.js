const fs = require('fs');

class Config {
  init() {
    return new Promise((resolve, reject) => {
      fs.readFile('./config/configuration.json', 'utf8', (err, data) => {
        if (!err) {
          this.response = JSON.parse(data);
          resolve();
        } else reject('config file not found!');
      });
    });
  }
  getAdmin() {
    return (this.response[this.response.configuration]).admin;
  }
  getAppName() {
    return this.response.appName;
  }
  getData(identity) {
    return this.response[this.response.configuration][identity];
  }

  getModel() {
    return (this.response[this.response.configuration]).models;
  }
}
module.exports = new Config();
