const Recommendations = require('./Recommendations'),
      SensorData = require('./SensorData'),

      model = require('../chariotModel'),
      Building = model.Building,
      Location = model.Location,

      generateId = require('./generateId');

let blankData = {
  configuration: {
    sources: [], reasoners: []
  },
  giotto: {
    devices: []
  },
  input: {
    rules: [],
    properties: []
  },
  recommended: {
    rules: []
  }
};

class Model {
  constructor(data, filter) {
    this.data = data || JSON.parse(JSON.stringify(blankData));
    this.filter = filter || {};

    this.data.userId = this.data.userId || generateId();
  }

  set building(building) { this.data.giotto = building.data; }
  set credentials(credentials) { this.data.credentials = credentials; }

  get id() { return this.building.id; }
  get building() { return new Building(this.data.giotto); }
  get devices() { return this.building.devices; }
  get locations() { return this.building.locations; }
  get sensors() { return this.building.sensors; }
  get actions() { return this.building.actions; }
  get credentials() { return this.data.credentials; }
  get virtualSensors() { return this.building.virtualSensors; }

  get recommendedVirtualSensors() {
    return this.recommendations.virtualSensors;
  }

  get rules() {
    return this.building.rules;
  }

  get allRecommenedRules() {
    return this.recommendations.rulesBySensorSimilarity;
  }

  get recommendations() {
    return new Recommendations(this.data.recommended, this);
  }

  locationFor(locationName) {
    return new Location({ name: locationName }, this.building);
  }

  sensorDataFor(sensor) {
    return new SensorData(sensor, this);
  }

  addDevice(device) { this.building.addDevice(device); }

  addRule(rule) {
    this.building.addRule(rule);
  }

  addVirtualSensor(virtualSensor) {
    this.building.addVirtualSensor(virtualSensor);
  }
}

Model.blankData = blankData;

module.exports = Model;
