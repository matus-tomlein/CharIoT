class NumericRuleCondition {
  constructor(condition) {
    this.condition = condition;

    this.lastValue = null;
    this.previouslySatisfied = false;
  }

  subscribedSensors() {
    return this.condition.sensors().map((sensor) => {
      return sensor.id;
    });
  }

  shouldNewSensorValueTrigger(newValue) {
    this.lastValue = newValue;

    var shouldTrigger = !this.previouslySatisfied && this.isSatisfied();
    this.previouslySatisfied = this.isSatisfied();
    return shouldTrigger;
  }

  isSatisfied() {
    var val = this.value();
    var conditionValue = this.condition.attributes.condition.value;

    switch (this.condition.attributes.condition.operator) {
    case 'EQ':
      return val == conditionValue;
    case 'NEQ':
      return val != conditionValue;
    case 'LT':
      return val < conditionValue;
    case 'LTE':
      return val <= conditionValue;
    case 'GT':
      return val > conditionValue;
    case 'GTE':
      return val >= conditionValue;
    }
    return false;
  }

  value() {
    return this.lastValue;
  }
}

module.exports = NumericRuleCondition;
