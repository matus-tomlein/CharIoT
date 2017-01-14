module.exports = {
  addNumericConditionAttribute: (condition) => {
    condition.addRequiredAttribute({
      name: 'condition',
      type: 'numericCondition'
    });
    condition.addAttribute('condition', { operator: 'EQ', value: 0 });
  },

  addLocationScopeAttribute: (condition) => {
    condition.addRequiredAttribute({
      name: 'locationScope',
      type: 'select',
      options: {
        all: 'All devices',
        any: 'Any device'
      }
    });
    condition.addAttribute('locationScope', 'all');
  },

  addVirtualSensorLabelAttribute: (condition, virtualSensor) => {
    var options = {};
    virtualSensor.labels.forEach((label) => {
      options[label] = label;
    });

    condition.addRequiredAttribute({
      name: 'label',
      type: 'select',
      options: options
    });
    condition.addAttribute('label', virtualSensor.labels[0]);
  }
};
