function readOperator(operator) {
  switch (operator) {
  case 'EQ': return '=';
  case 'NEQ': return '\u2260';
  case 'LT': return '<';
  case 'LTE': return '\u2264';
  case 'GT': return '>';
  case 'GTE': return '\u2265';
  }
}

class ConditionOrActionLabels {
  constructor(condition) {
    this.condition = condition;
  }

  sourceName() {
    let that = this.condition;
    if (that.data.locationName) {
      return 'in ' + that.data.locationName;
    } else if (that.data.deviceId && that._model) {
      return 'on ' + that.device.name;
    }
    return '';
  }

  serviceName() {
    var condition = this.condition;

    if (condition.sensorType) {
      return condition.sensorType;
    }
    else if (condition.actionType) {
      return condition.actionType;
    }
    else if (condition.virtualSensor) {
      return condition.virtualSensor.name;
    }

    return '';
  }

  serviceNameWithSource() {
    let name = this.serviceName();
    if (name)
      return [name, this.sourceName()].join(' ');

    return name;
  }

  describeAttributes() {
    let that = this.condition;
    let parts = [];
    that.requiredAttributes.forEach((requiredAttribute) => {
      if (requiredAttribute.type == 'numericCondition') {
        let attribute = that.attributes[requiredAttribute.name];
        if (attribute) {
          parts.push(readOperator(attribute.operator));
          parts.push(attribute.value);
        }
      } else if (requiredAttribute.type == 'select') {
        let attribute = that.attributes[requiredAttribute.name];
        if (attribute) {
          parts.push(' – ' + requiredAttribute.options[attribute]);
        }
      }
    });
    return parts.join(' ');
  }

  name() {
    let that = this.condition;
    let name = this.serviceName();

    if (name) {
      name = [ name, this.describeAttributes() ].join(' ');
      if (that.data.locationName) {
        name += ' (' + that.data.locationName + ')';
      } else if (that.data.deviceId && that._model) {
        name += ' (' + that.device.name + ')';
      }
    }

    return name;
  }
}

module.exports = ConditionOrActionLabels;
