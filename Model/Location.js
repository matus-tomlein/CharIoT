const LocationSensor = require('./LocationSensor'),
      LocationAction = require('./LocationAction'),

      hashString = require('./hashString');

class Location {
  constructor(name, model) {
    this.model = model;
    this.id = hashString('location-' + name);
    this.name = name;
  }

  devices() {
    return this.model.devices.filter((device) => {
      return device.locations.map((l) => {
        return l.name;
      }).includes(this.name);
    });
  }

  actions() {
    var actionDevices = {};
    this.devices().forEach((d) => {
      d.actions.forEach((s) => {
        if (actionDevices[s.name]) {
          actionDevices[s.name].push(d);
        } else {
          actionDevices[s.name] = [ d ];
        }
      });
    });

    var locationActions = [];
    for (var sensor in actionDevices) {
      locationActions.push(new LocationAction(sensor, this, actionDevices[sensor]));
    }

    return locationActions;
  }

  sensors() {
    var sensorDevices = {};
    this.devices().forEach((d) => {
      d.sensors.forEach((s) => {
        if (sensorDevices[s.name]) {
          sensorDevices[s.name].push(d);
        } else {
          sensorDevices[s.name] = [ d ];
        }
      });
    });

    var locationSensors = [];
    for (var sensor in sensorDevices) {
      locationSensors.push(new LocationSensor(sensor, this, sensorDevices[sensor]));
    }

    return locationSensors;
  }
}

module.exports = Location;
