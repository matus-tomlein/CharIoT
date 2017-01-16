const Location = require('./Location'),
      Sensor = require('./Sensor'),
      Action = require('./Action'),

      generateId = require('./generateId');

class Device {
  constructor(data, model) {
    this.data = data;
    this.id = data.id || generateId();
    this.tagId = data.tagId;
    this.name = data.name;
    this.locations = (data.locations || []).map((location) => {
      return new Location(location.name, model);
    });
    this.sensors = (data.sensors || []).map((sensor) => {
      return new Sensor(sensor, this);
    });
    this.actions = (data.actions || []).map((action) => {
      return new Action(action, this);
    });
  }

  addLocation(location) { this.locations.push(location); }
  addSensor(sensor) { this.sensors.push(sensor); }
  addAction(action) { this.actions.push(action); }

  toData() {
    return {
      id: this.id,
      tagId: this.tagId,
      name: this.name,
      locations: this.locations.map((location) => {
        return location.toData();
      }),
      sensors: this.sensors.map((sensor) => {
        return sensor.toData();
      }),
      actions: this.actions.map((action) => {
        return action.toData();
      })
    };
  }
}

module.exports = Device;
