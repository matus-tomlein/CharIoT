const Location = require('./Location'),
      Sensor = require('./Sensor'),
      Action = require('./Action');

function Device(data, model) {
  this.data = data;
  this.id = data.id;
  this.tagId = data.tagId;
  this.name = data.name;
  this.locations = data.locations.map((location) => {
    return new Location(location.name, model);
  });
  this.sensors = data.sensors.map((sensor) => {
    return new Sensor(sensor, this);
  });
  this.actions = data.actions.map((action) => {
    return new Action(action, this);
  });
}

module.exports = Device;
