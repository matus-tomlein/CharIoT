const hashString = require('./hashString'),
      _ = require('underscore');

class LocationSensor {
  constructor(name, location, devices) {
    this.id = hashString(location.name + '-' + name);
    this.name = name;
    this.location = location;
    this.devices = devices;
  }

  sensors() {
    return _.flatten(this.devices.map((device) => {
      return device.sensors.filter((sensor) => {
        return sensor.name == this.name;
      });
    }));
  }
}

module.exports = LocationSensor;
