const ConditionOrActionInitializer = require('../../../Model/ConditionOrActionInitializer');

module.exports = {
  addActionOptionsAttribute: (condition, action) => {
    new ConditionOrActionInitializer(condition).addActionOptionsAttribute(action);
  },

  addVirtualSensorLabelAttribute: (condition, virtualSensor) => {
    new ConditionOrActionInitializer(condition).addVirtualSensorLabelAttribute(virtualSensor);
  }
};
