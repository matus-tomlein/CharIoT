class VirtualSensorRuleCondition {
  constructor(condition) {
    this.condition = condition;

    this.lastValue = null;
    this.previouslySatisfied = false;
  }

  subscribedSensors() {
    return this.condition.virtualSensors.map((s) => {
      return s.id;
    });
  }

  shouldNewSensorValueTrigger(newValue, uuid) {
    newValue = parseInt(newValue);

    let vs = this.condition.virtualSensors.find((vs) => { return vs.id == uuid; });
    if (vs) {
      newValue = vs.labels[newValue];
      console.log(newValue);
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
