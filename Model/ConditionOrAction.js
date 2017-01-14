const _ = require('underscore'),
      Location = require('./Location');

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

class ConditionOrAction {
  constructor(data, model) {
    this.data = data || {};
    this._model = model;
  }

  addRequiredAttribute(att) {
    this.data.requiredAttributes = this.data.requiredAttributes || [];
    this.data.requiredAttributes.push(att);
  }

  addAttribute(name, value) {
    this.data.attributes = this.data.attributes || {};
    this.data.attributes[name] = value;
  }

  setFromActionType(type) {
    this.data.actionType = type;
  }

  sensorType() {
    return this.data.sensorType;
  }

  sensors() {
    var location = this.location();
    if (location) {
      return _.flatten(location.sensors().filter((locationSensor) => {
        return locationSensor.name == this.sensorType();
      }).map((locationSensor) => {
        return locationSensor.sensors();
      }));
    }

    var device = this.device();
    if (device) {
      return device.sensors.filter((deviceSensor) => {
        return deviceSensor.name == this.sensorType();
      });
    }

    return [];
  }

  devicesWithAction() {
    var location = this.location();
    if (location) {
      return _.flatten(location.actions().filter((locationAction) => {
        return locationAction.name == this.actionType();
      }).map((locationAction) => {
        return locationAction.devices;
      }));
    }

    var device = this.device();
    if (device) {
      return [device];
    }

    return [];
  }

  actionType() {
    return this.data.actionType;
  }

  setFromSensorType(type) {
    this.data.sensorType = type;
  }

  setVirtualSensor(virtualSensor) {
    this.data.virtualSensorId = virtualSensor.id;
    this.setInLocation(virtualSensor.location());
  }

  virtualSensor() {
    if (this.data.virtualSensorId && this._model) {
      return this._model.virtualSensors.find((virtualSensor) => {
        return virtualSensor.id == this.data.virtualSensorId;
      });
    }
  }

  setInLocation(location) {
    this.data.locationName = location.name;
  }

  location() {
    if (this.data.locationName && this._model) {
      return new Location(this.data.locationName, this._model);
    }
  }

  setDevice(device) {
    this.data.deviceId = device.id;
  }

  device() {
    if (this.data.deviceId && this._model) {
      return this._model.devices.find((device) => {
        return device.id == this.data.deviceId;
      });
    }
  }

  serviceName() {
    var name;

    if (this.data.sensorType) {
      name = this.data.sensorType;
    }
    else if (this.data.actionType) {
      name = this.data.actionType;
    }
    else if (this.data.virtualSensorId && this._model) {
      var virtualSensor = this.virtualSensor();
      name = virtualSensor.name;
    }

    return name;
  }

  sourceName() {
    if (this.data.locationName) {
      return 'in ' + this.data.locationName;
    } else if (this.data.deviceId && this._model) {
      return 'on ' + this.device().name;
    }
    return '';
  }

  serviceNameWithSource() {
    var name = this.serviceName();
    if (name)
      return [name, this.sourceName()].join(' ');

    return name;
  }

  describeAttributes() {
    var parts = [];
    this.requiredAttributes().forEach((requiredAttribute) => {
      if (requiredAttribute.type == 'numericCondition') {
        var attribute = this.attributes()[requiredAttribute.name];
        if (attribute) {
          parts.push(readOperator(attribute.operator));
          parts.push(attribute.value);
        }
      } else if (requiredAttribute.type == 'select') {
        var attribute = this.attributes()[requiredAttribute.name];
        if (attribute) {
          parts.push(' – ' + requiredAttribute.options[attribute]);
        }
      }
    });
    return parts.join(' ');
  }

  name() {
    var name = this.serviceName();

    if (name) {
      name = [ name, this.describeAttributes() ].join(' ');
      if (this.data.locationName) {
        name += ' (' + this.data.locationName + ')';
      } else if (this.data.deviceId && this._model) {
        name += ' (' + this.device().name + ')';
      }
    }

    return name;
  }

  requiredAttributes() {
    return this.data.requiredAttributes || [];
  }

  attributes() {
    return this.data.attributes || {};
  }

  hasChosenService() {
    return this.data.sensorType || this.data.actionType || this.data.virtualSensorId;
  }

  hasLocation() { return this.data.locationName; }
  requiresSensor() { return this.data.sensorType; }
  requiresDevice() { return this.data.deviceId; }
  requiresVirtualSensor() { return this.data.virtualSensorId; }
  requiresAction() { return this.data.actionType; }
}

module.exports = ConditionOrAction;
