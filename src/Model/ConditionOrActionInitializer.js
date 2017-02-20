class ConditionOrActionInitializer {
  constructor(condition) {
    this.condition = condition;
  }

  addActionOptionsAttribute(action, selected) {
    let options = action.options;
    this.condition.options = options;
    this.condition.value = selected || Object.keys(options)[0];
  }

  addVirtualSensorLabelAttribute(virtualSensor, selected) {
    let options = {};
    virtualSensor.labels.forEach((label) => {
      options[label] = label;
    });
    this.condition.options = options;
    this.condition.value = selected || virtualSensor.labels[0];
  }
}

module.exports = ConditionOrActionInitializer;
