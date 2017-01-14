const _ = require('underscore');

const Rule = require('./Rule'),
      Device = require('./Device'),
      VirtualSensor = require('./VirtualSensor'),
      Location = require('./Location');

function wrap(items, wrappingClass, model) {
  return items.map((i) => { return new wrappingClass(i, model); });
}

function initializeModel(model, data) {
  // copy things that don't need to be wrapped
  [
    'model',
    'input',
    'userId'
  ].forEach((key) => { model[key] = data[key]; });

  [
    'devices'
  ].forEach((key) => { model[key] = data.giotto[key] || []; });

  [
    'virtualSensors',
    'rules'
  ].forEach((key) => { model[key] = data.input[key] || []; });

  model.devices = wrap(model.devices, Device);

  model.virtualSensors = wrap(model.virtualSensors, VirtualSensor, model);
  model.rules = wrap(model.rules, Rule, model);
  model.allRecommenedRules = wrap(data.recommended.rules, Rule, model);
}

class Model {
  constructor(data, filter = {}) {
    initializeModel(this, data);
    this.filter = filter;
  }

  locations() {
    var names = this.devices.map((device) => {
      return device.locations.map((l) => { return l.name; });
    });

    return _.uniq(_.flatten(names)).map((name) => {
      return new Location(name, this);
    });
  }

  sensors() {
    var sensors = this.devices((device) => {
      return device.sensors;
    });
    return _.flatten(sensors);
  }

  actions() {
    var actions = this.devices((device) => {
      return device.actions;
    });
    return _.flatten(actions);
  }

  recommendedRules() {
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
}

Model.blankData = {
  configuration: {
    sources: [], reasoners: []
  },
  giotto: {
    devices: []
  },
  input: {
    properties: [],
    virtualSensors: []
  },
  recommended: {
    rules: []
  }
};

module.exports = Model;
