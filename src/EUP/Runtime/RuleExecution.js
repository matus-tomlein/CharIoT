var NumericRuleCondition = require('./NumericRuleCondition'),
    _ = require('underscore'),
    VirtualSensorRuleCondition = require('./VirtualSensorRuleCondition'),
    RuleAction = require('./RuleAction');

class RuleExecution {
  constructor(rule, runtime) {
    this.rule = rule;
    this.runtime = runtime;

    this.conditions = [];
    rule.conditions.forEach((condition) => {
      if (condition.requiresSensor()) {
        this.conditions.push(new NumericRuleCondition(condition));
      } else if (condition.requiresVirtualSensor()) {
        this.conditions.push(new VirtualSensorRuleCondition(condition));
      } else {
        console.error('Unsupported rule condition');
      }
    });

    this.actions = [];
    rule.actions.forEach((action) => {
      if (action.requiresAction()) {
        this.actions.push(new RuleAction(action, runtime.api));
      } else {
        console.error('Unsupported rule action');
      }
    });

    this.subscribeToSensors = this.conditions.filter(function (condition) {
      return condition.subscribedSensors;
    }).map(function (condition) {
      return condition.subscribedSensors();
    });

    this.subscribeToVirtualSensors = this.conditions.filter(function (condition) {
      return condition.subscribedVirtualSensor;
    }).map(function (condition) {
      return condition.subscribedVirtualSensor();
    });
  }

  isSatisfied() {
    var satisfied = true;
    this.conditions.forEach(function (condition) {
      if (!condition.isSatisfied())
        satisfied = false;
    });

    return satisfied;
  }

  sensorsValueUpdated(sensors, value) {
    var sensorsToKey = (sensors) => { return _.sortBy(sensors).join(','); };
    var key = sensorsToKey(sensors);
    var shouldTrigger = false;

    this.conditions.filter(function (condition) {
      return condition.subscribedSensors &&
        sensorsToKey(condition.subscribedSensors()) == key;
    }).forEach(function (condition) {
      if (condition.shouldNewSensorValueTrigger(value))
        shouldTrigger = true;
    });

    if (shouldTrigger && this.isSatisfied()) {
      this.executeActions();
    }
  }

  virtualSensorValueUpdated(sensor, value) {
    var shouldTrigger = false;
    this.conditions.filter(function (condition) {
      return condition.subscribedVirtualSensor &&
        condition.subscribedVirtualSensor().id == sensor.id;
    }).forEach(function (condition) {
      if (condition.shouldNewSensorValueTrigger(value))
        shouldTrigger = true;
    });

    if (shouldTrigger && this.isSatisfied()) {
      this.executeActions();
    }
  }

  executeActions() {
    this.actions.forEach(function (action) {
      action.trigger();
    });
  }
}

module.exports = RuleExecution;
