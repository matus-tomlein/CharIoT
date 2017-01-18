const Location = require('../../src/Model/Location'),
      Rule = require('../../src/Model/Rule'),
      ConditionOrAction = require('../../src/Model/ConditionOrAction');

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

  virtualSensorCondition(virtualSensor, label) {
    let condition = new ConditionOrAction({}, this.model);
    condition.virtualSensor = virtualSensor;
    condition.initializer().addVirtualSensorLabelAttribute(virtualSensor, label);
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

module.exports = RuleFactory;
