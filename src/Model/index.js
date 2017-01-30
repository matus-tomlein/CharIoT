const _ = require('underscore');

const Rule = require('./Rule'),
      VirtualSensor = require('./VirtualSensor'),
      Recommendations = require('./Recommendations'),
      SensorData = require('./SensorData'),

      model = require('chariot-model'),
      Building = model.Building,

      generateId = require('./generateId');

function wrap(items, wrappingClass, model) {
  return items.map((i) => { return new wrappingClass(i, model); });
}

let blankData = {
  configuration: {
    sources: [], reasoners: []
  },
  giotto: {
    devices: []
  },
  input: {
    rules: [],
    properties: [],
    virtualSensors: []
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

  get id() { return this.data.userId || generateId(); }
  get building() { return new Building(this.data.giotto); }
  get devices() { return this.building.devices; }
  get locations() { return this.building.locations; }
  get sensors() { return this.building.sensors; }
  get actions() { return this.building.actions; }
  get credentials() { return this.data.credentials; }

  get virtualSensors() {
    return wrap(this.data.input.virtualSensors, VirtualSensor, this);
  }

  get recommendedVirtualSensors() {
    return this.recommendations.virtualSensors;
  }

  get rules() {
    return wrap(this.data.input.rules, Rule, this);
  }

  get allRecommenedRules() {
    return this.recommendations.rulesBySensorSimilarity;
  }

  get recommendedRules() {
    var filteredRules = this.allRecommenedRules;

    if (this.filter.selectedLocations.length) {
      var selectedLocations = this.filter.selectedLocations;
      filteredRules = filteredRules.filter((rule) => {
        return _.intersection(selectedLocations, rule.locationNames()).length > 0;
      });
    }

    if (this.filter.selectedSensors.length) {
      var selectedSensors = this.filter.selectedSensors;
      filteredRules = filteredRules.filter((rule) => {
        return _.intersection(selectedSensors, rule.sensorTypes()).length > 0;
      });
    }

    if (this.filter.selectedActions.length) {
      var selectedActions = this.filter.selectedActions;
      filteredRules = filteredRules.filter((rule) => {
        return _.intersection(selectedActions, rule.actionTypes()).length > 0;
      });
    }

    return filteredRules;
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
    this.data.input.rules.push(rule.toData());
  }

  addVirtualSensor(virtualSensor) {
    this.data.input.virtualSensors.push(virtualSensor.toData());
  }
}

Model.blankData = blankData;

module.exports = Model;
