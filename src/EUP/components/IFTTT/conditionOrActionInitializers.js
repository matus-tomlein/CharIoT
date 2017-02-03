module.exports = {
  addNumericConditionAttribute: (condition) => {
    condition.initializer().addNumericConditionAttribute();
  },

  addLocationScopeAttribute: (condition) => {
    condition.initializer().addLocationScopeAttribute();
  },

  addActionOptionsAttribute: (condition, action) => {
    condition.initializer().addActionOptionsAttribute(action);
  },

  addVirtualSensorLabelAttribute: (condition, virtualSensor) => {
    condition.initializer().addVirtualSensorLabelAttribute(virtualSensor);
  }
};
