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
  get sensorData() {
    if (this.model && this.model.data.sensorData &&
        this.model.data.sensorData[this.id]) {
      return this.model.data.sensorData[this.id];
    }
  }
  get fuzzySetData() {
    let sensorData = this.sensorData;
    return sensorData.fuzzySetData;
  }
  get fuzzySetDataStoredAt() {
    let sensorData = this.sensorData;
    if (sensorData) {
      return sensorData.storedAt;
    }
  }

  set id(id) { this.data.id = id; }
  set name(name) { this.data.name = name; }
  set min(min) { this.data.min = min; }
  set max(max) { this.data.max = max; }

  storeFuzzySetData(fuzzySetData) {
    let model = this.model;
    if (model) {
      if (!model.data.sensorData) { model.data.sensorData = {}; }

      model.data.sensorData[this.id] = {
        fuzzySetData: fuzzySetData,
        storedAt: new Date()
      };
    }
  }

  hasUpToDateFuzzySetData() {
    if (!this.fuzzySetDataStoredAt) return false;

    let hourDifference = (new Date() - new Date(this.fuzzySetDataStoredAt)) / (60 * 60 * 1000);
    return hourDifference < 48;
  }

  toData() {
    return this.data;
  }
}

module.exports = Sensor;
