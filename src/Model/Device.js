const Location = require('./Location'),
      Sensor = require('./Sensor'),
      Action = require('./Action'),

      generateId = require('./generateId');

class Device {
  constructor(data, model) {
    this.data = data;
    this.model = model;

    this.id = this.id || generateId();
    this.data.locations = this.data.locations || [];
    this.data.sensors = this.data.sensors || [];
    this.data.actions = this.data.actions || [];
  }

  get id() { return this.data.id || generateId(); }
  get tagId() { return this.data.tagId; }
  get name() { return this.data.name; }
  get locations() {
    return (this.data.locations || []).map((location) => {
      return new Location(location.name, this.model);
    });
  }
  get sensors() {
    return (this.data.sensors || []).map((sensor) => {
      return new Sensor(sensor, this);
    });
  }
  get actions() {
    return (this.data.actions || []).map((action) => {
      return new Action(action, this);
    });
  }

  set id(id) { this.data.id = id; }
  set tagId(tagId) { this.data.tagId = tagId; }
  set name(name) { this.data.name = name; }

  addLocation(location) { this.data.locations.push(location.toData()); }
  addSensor(sensor) { this.data.sensors.push(sensor.toData()); }
  addAction(action) { this.data.actions.push(action.toData()); }

  toData() { return this.data; }
}

module.exports = Device;
