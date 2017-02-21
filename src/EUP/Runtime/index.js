var _ = require('underscore'),

    VirtualSensorUpdater = require('./VirtualSensorUpdater'),
    SensorUpdater = require('./SensorUpdater'),
    RuleExecution = require('./RuleExecution');

function receivedVirtualSensorUpdate(runtime, sensor, value) {
  if (!runtime.running) return;

  console.log(sensor.name, value);
  runtime.ruleExecutions.forEach(function (ruleExecution) {
    ruleExecution.virtualSensorValueUpdated(sensor, value);
  });
}

class Runtime {
  constructor(api) {
    this.api = api;
    this.ruleExecutions = [];
    this.virtualSensorUpdaters = [];
    this.sensorUpdaters = [];
    this.running = false;
  }

  installRule(rule) {
    var ruleExecution = new RuleExecution(rule, this);
    this.ruleExecutions.push(ruleExecution);
  }

  start(model) {
    this.running = true;

    model.rules.forEach((rule) => {
      this.installRule(rule);
    });

    this._initializeSensors();
    this._initializeVirtualSensors();
  }

  reset() {
    if (!this.running) return;
    this.running = false;

    this.sensorUpdaters.forEach((updater) => {
      updater.stop();
    });
    this.virtualSensorUpdaters.forEach((updater) => {
      updater.stop();
    });

    this.ruleExecutions = [];
    this.sensorUpdaters = [];
    this.virtualSensorUpdaters = [];
  }

  _initializeSensors() {
    var sensorsToKey = (sensors) => { return _.sortBy(sensors).join(','); };
    var subscribedSensors = {};

    this.ruleExecutions.forEach((ruleExecution) => {
      ruleExecution.subscribeToSensors.forEach((sensors) => {
        var key = sensorsToKey(sensors);
        subscribedSensors[key] = sensors;
      });
    });

    this.sensorUpdaters = Object.keys(subscribedSensors).map((key) => {
      var sensors = subscribedSensors[key];

      var updater = new SensorUpdater(sensors, this.api);
      updater.start((value, uuid) => {
        if (!this.running) return;

        console.log(key, value);
        this.ruleExecutions.forEach(function (ruleExecution) {
          ruleExecution.sensorsValueUpdated(sensors, value, uuid);
        });
      });

      return updater;
    });
  }

  _initializeVirtualSensors() {
    var virtualSensors = this.ruleExecutions.filter((ruleExecution) => {
      return ruleExecution.subscribeToVirtualSensors.length;
    }).map(function (ruleExecution) {
      return ruleExecution.subscribeToVirtualSensors;
    });
    virtualSensors = _.uniq(_.flatten(virtualSensors));

    this.virtualSensorUpdaters = virtualSensors.map((sensor) => {
      var updater = new VirtualSensorUpdater(sensor, this.api);
      updater.start((value) => {
        receivedVirtualSensorUpdate(this, sensor, value);
      });
      return updater;
    });
  }
}

module.exports = Runtime;
