const generateId = require('./generateId');

class Sensor {
  constructor(data, device) {
    this.data = data;
    this.device = device;
    this.id = this.id || generateId();
  }

  get id() { return this.data.id; }
  get name() { return this.data.name; }
  get min() { return this.data.min || 0; }
  get max() { return this.data.max || 100; }
  get model() { return this.device.model; }

  set id(id) { this.data.id = id; }
  set name(name) { this.data.name = name; }
  set min(min) { this.data.min = min; }
  set max(max) { this.data.max = max; }

  toData() {
    return this.data;
  }
}

module.exports = Sensor;
