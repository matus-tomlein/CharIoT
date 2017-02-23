var VirtualSensorRuleCondition = require('./VirtualSensorRuleCondition'),
    RuleAction = require('./RuleAction');

class RuleExecution {
  constructor(rule, runtime) {
    this.rule = rule;
    this.runtime = runtime;

    this.conditions = [];
    rule.conditions.forEach((condition) => {
      if (condition.requiresVirtualSensor()) {
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
  }

  isSatisfied() {
    var satisfied = true;
    this.conditions.forEach(function (condition) {
      if (!condition.isSatisfied())
        satisfied = false;
    });

    return satisfied;
  }

  sensorValueUpdated(virtualSensorId, value) {
    var shouldTrigger = false;
    this.conditions.filter((condition) => {
      if (condition.subscribedSensors) {
        let found = condition.subscribedSensors().find((vs) => {
          return vs.id == virtualSensorId;
        });
        return found ? true : false;
      }
      return false;
    }).forEach((condition) => {
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
