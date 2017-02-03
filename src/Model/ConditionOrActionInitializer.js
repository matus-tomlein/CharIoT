class ConditionOrActionInitializer {
  constructor(condition) {
    this.condition = condition;
  }

  addNumericConditionAttribute(operator, value) {
    this.condition.addRequiredAttribute({
      name: 'condition',
      type: 'numericCondition'
    });
    this.condition.addAttribute('condition', {
      operator: operator || 'EQ',
      value: value || 0
    });
  }

  addLocationScopeAttribute() {
    this.condition.addRequiredAttribute({
      name: 'locationScope',
      type: 'select',
      options: {
        all: 'All devices',
        any: 'Any device'
      }
    });
    this.condition.addAttribute('locationScope', 'all');
  }

  addActionOptionsAttribute(action) {
    let options = action.options;
    this.condition.addRequiredAttribute({
      name: 'parameter',
      type: 'select',
      options: options
    });
    this.condition.addAttribute('parameter', Object.keys(options)[0]);
  }

  addVirtualSensorLabelAttribute(virtualSensor, selected) {
    let options = {};
    virtualSensor.labels.forEach((label) => {
      options[label] = label;
    });

    this.condition.addRequiredAttribute({
      name: 'label',
      type: 'select',
      options: options
    });
    this.condition.addAttribute('label', selected || virtualSensor.labels[0]);
  }
}

module.exports = ConditionOrActionInitializer;
