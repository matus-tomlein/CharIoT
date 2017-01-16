const Model = require('../src/Model'),
      Device = require('../src/Model/Device'),
      Sensor = require('../src/Model/Sensor'),
      Action = require('../src/Model/Action'),
      Location = require('../src/Model/Location'),
      Rule = require('../src/Model/Rule'),
      ConditionOrAction = require('../src/Model/ConditionOrAction');

class RuleFactory {
  constructor(model) {
    this.model = model;
    this.rule = new Rule({}, model);
  }

  sensorConditionOnDevice(sensorName, operator, value, device) {
    let condition = new ConditionOrAction({}, this.model);
    condition.sensorType = sensorName;
    condition.device = device;
    condition.initializer().addNumericConditionAttribute(operator, value);
    this.rule.addCondition(condition);
  }

  sensorConditionInLocation(sensorName, operator, value, location) {
    let condition = new ConditionOrAction({}, this.model);
    condition.sensorType = sensorName;
    condition.location = new Location(location, this.model);
    condition.initializer().addNumericConditionAttribute(operator, value);
    this.rule.addCondition(condition);
  }

  actionInLocation(actionName, location) {
    let action = new ConditionOrAction({}, this.model);
    action.actionType = actionName;
    action.location = new Location(location, this.model);
    action.initializer().addLocationScopeAttribute();
    this.rule.addAction(action);
  }

  actionOnDevice(actionName, device) {
    let action = new ConditionOrAction({}, this.model);
    action.actionType = actionName;
    action.device = device;
    this.rule.addAction(action);
  }

  save() {
    this.model.addRule(this.rule);
  }
}

class InstallationFactory {
  constructor() {
    this.model = new Model();
  }

  sensortag(location) {
    let device = new Device({ name: 'sensortag' }, this.model);

    [ 'Temperature', 'Humidity', 'Lux', 'Pressure' ].forEach((sensorName) => {
      let sensor = new Sensor({ name: sensorName }, device);
      device.addSensor(sensor);
    });

    [ 'Buzzer', 'Red LED', 'Green LED', 'Blue LED' ].forEach((actionName) => {
      let action = new Action({ name: actionName }, device);
      device.addAction(action);
    });

    device.addLocation(new Location(location, this.model));

    this.model.addDevice(device);

    return device;
  }

  rule(callback) {
    let ruleFactory = new RuleFactory(this.model);
    if (callback) {
      callback(ruleFactory);
    }
    ruleFactory.save();
  }
}

module.exports = (callback) => {
  let installationFactory = new InstallationFactory();
  if (callback) {
    callback(installationFactory);
  }
  return installationFactory.model;
};
