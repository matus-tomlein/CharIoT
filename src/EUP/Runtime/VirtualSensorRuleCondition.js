class VirtualSensorRuleCondition {
  constructor(condition) {
    this.condition = condition;

    this.lastValue = null;
    this.previouslySatisfied = false;
  }

  subscribedVirtualSensor() {
    return this.condition.virtualSensor;
  }

  shouldNewSensorValueTrigger(newValue) {
    this.lastValue = newValue;

    var shouldTrigger = !this.previouslySatisfied && this.isSatisfied();
    this.previouslySatisfied = this.isSatisfied();
    return shouldTrigger;
  }

  isSatisfied() {
    return this.condition.attributes.label == this.lastValue;
  }
}

module.exports = VirtualSensorRuleCondition;
