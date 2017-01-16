module.exports = {
  addNumericConditionAttribute: (condition) => {
    condition.initializer().addNumericConditionAttribute();
  },

  addLocationScopeAttribute: (condition) => {
    condition.initializer().addLocationScopeAttribute();
  },

  addVirtualSensorLabelAttribute: (condition, virtualSensor) => {
    condition.initializer().addVirtualSensorLabelAttribute(virtualSensor);
  }
};
