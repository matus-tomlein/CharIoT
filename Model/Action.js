const hashString = require('./hashString');

class Action {
  constructor(data, device) {
    this.id = hashString(device.id + '-' + data.name);
    this.name = data.name;
    this.device = device;
  }
}

module.exports = Action;
