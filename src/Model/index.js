const _ = require('underscore');

const Rule = require('./Rule'),
      Device = require('./Device'),
      VirtualSensor = require('./VirtualSensor'),
      Location = require('./Location'),

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

  get id() { return this.data.userId || generateId(); }

  addDevice(device) {
    this.data.giotto.devices.push(device.toData());
  }

  addRule(rule) {
    this.data.input.rules.push(rule.toData());
  }

  addVirtualSensor(virtualSensor) {
    this.data.input.virtualSensors.push(virtualSensor.toData());
  }

  get devices() {
    return wrap(this.data.giotto.devices, Device, this);
  }

  get virtualSensors() {
    return wrap(this.data.input.virtualSensors, VirtualSensor, this);
  }

  get recommendedVirtualSensors() {
    return wrap(this.data.recommended.virtualSensors, VirtualSensor, this);
  }

  get rules() {
    return wrap(this.data.input.rules, Rule, this);
  }

  get allRecommenedRules() {
    return wrap(this.data.recommended.rules, Rule, this);
  }

  get locations() {
    var names = this.devices.map((device) => {
      return device.locations.map((l) => { return l.name; });
    });

    return _.uniq(_.flatten(names)).map((name) => {
      return new Location(name, this);
    });
  }

  get sensors() {
    var sensors = this.devices.map((device) => {
      return device.sensors;
    });
    return _.flatten(sensors);
  }

  get actions() {
    var actions = this.devices.map((device) => {
      return device.actions;
    });
    return _.flatten(actions);
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
}

Model.blankData = blankData;

module.exports = Model;
