class VirtualSensorRuleCondition {
  constructor(condition) {
    this.condition = condition;

    this.lastValue = null;
    this.previouslySatisfied = false;
  }

  subscribedSensors() {
    return this.condition.virtualSensors;
  }

  shouldNewSensorValueTrigger(newValue, uuid) {
    let vs = this.condition.virtualSensors.find((vs) => { return vs.id == uuid; });
    if (vs) {
      this.lastValue = newValue;

      var shouldTrigger = !this.previouslySatisfied && this.isSatisfied();
      this.previouslySatisfied = this.isSatisfied();
      return shouldTrigger;
    }
  }

  isSatisfied() {
    return this.condition.value == this.lastValue;
  }
}

module.exports = VirtualSensorRuleCondition;
