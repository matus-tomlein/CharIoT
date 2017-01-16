const hashString = require('./hashString');

class LocationAction {
  constructor(name, location, devices) {
    this.id = hashString(location.name + '-' + name);
    this.name = name;
    this.location = location;
    this.devices = devices;
  }
}

module.exports = LocationAction;
