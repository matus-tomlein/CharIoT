const _ = require('underscore'),

      Model = require('../../src/Model'),
      DataModel = require('../../src/DataModel'),
      SensortagDeviceFactory = require('./SensortagDeviceFactory'),
      VirtualSensorFactory = require('./VirtualSensorFactory'),
      RuleFactory = require('./RuleFactory');

class InstallationFactory {
  constructor() {
    this.model = new Model();
    this.sensorDataSamplings = [];
  }

  sensortag(location, callback) {
    let factory = new SensortagDeviceFactory(location, this.model, this);

    if (callback) {
      callback(factory);
    }
    factory.save();

    return factory.device;
  }

  virtualSensor(name, labels, callback) {
    let factory = new VirtualSensorFactory(name, labels, this.model);
    if (callback) {
      callback(factory);
    }
    factory.save();
    return factory.virtualSensor;
  }

  rule(callback) {
    let ruleFactory = new RuleFactory(this.model);
    if (callback) {
      callback(ruleFactory);
    }
    ruleFactory.save();
    return ruleFactory.rule;
  }

  generateSensorData(device, sensor, samplingFunction) {
    this.sensorDataSamplings.push({
      device: device,
      sensor: sensor,
      samplingFunction: samplingFunction
    });
  }

  get dataModel() {
    let dataModel = new DataModel(this.model);

    this.sensorDataSamplings.forEach((sensorDataSampling) => {
      let sensor = sensorDataSampling.device.sensors.find((sensor) => {
        return sensor.name == sensorDataSampling.sensor;
      });
      let values = _(500).times(() => {
        return {
          value: sensorDataSampling.samplingFunction()
        };
      });

      dataModel.addSensorMeasurements(sensor, values);
    });

    return dataModel;
  }
}

module.exports = InstallationFactory;
