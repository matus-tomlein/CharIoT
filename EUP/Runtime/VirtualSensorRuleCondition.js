function VirtualSensorRuleCondition(condition) {
  this.condition = condition;

  this.lastValue = null;
  this.previouslySatisfied = false;
}

VirtualSensorRuleCondition.prototype = (function () {
  return {
    subscribedVirtualSensor: function () {
      return this.condition.virtualSensor();
    },

    shouldNewSensorValueTrigger: function (newValue) {
      this.lastValue = newValue;

      var shouldTrigger = !this.previouslySatisfied && this.isSatisfied();
      this.previouslySatisfied = this.isSatisfied();
      return shouldTrigger;
    },

    isSatisfied: function () {
      return this.condition.attributes().label == this.lastValue;
    }
  };
})();

module.exports = VirtualSensorRuleCondition;
