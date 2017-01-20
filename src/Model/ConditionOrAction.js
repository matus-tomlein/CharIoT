const _ = require('underscore'),
      Location = require('./Location'),
      VirtualSensor = require('./VirtualSensor'),
      ConditionOrActionLabels = require('./ConditionOrActionLabels'),
      ConditionOrActionInitializer = require('./ConditionOrActionInitializer'),
      generateId = require('./generateId');

class ConditionOrAction {
  constructor(data, model) {
    this.data = data || {};
    data.id = data.id || generateId();
    this._model = model;
  }

  initializer() { return new ConditionOrActionInitializer(this); }

  get id() { return this.data.id; }
  get sensorType() { return this.data.sensorType; }
  get actionType() { return this.data.actionType; }
  get requiredAttributes() { return this.data.requiredAttributes || []; }
  get attributes() { return this.data.attributes || {}; }
  get recommendedVirtualSensor() {
    if (this.data.recommendedVirtualSensor) {
      return new VirtualSensor(this.data.recommendedVirtualSensor, this._model);
    }
    if (this.data.recommendedVirtualSensorId && this._model) {
      return this._model.recommendedVirtualSensors.find((virtualSensor) => {
        return virtualSensor.id == this.data.recommendedVirtualSensorId;
      });
    }
  }

  set attributes(data) { this.data.attributes = data; }
  set requiredAttributes(data) { this.data.requiredAttributes = data; }
  set sensorType(type) { this.data.sensorType = type; }
  set actionType(type) { this.data.actionType = type; }
  set location(location) { this.data.locationName = location.name; }
  set device(device) { this.data.deviceId = device.id; }
  set virtualSensor(virtualSensor) {
    this.data.recommendedVirtualSensorId = undefined;
    this.data.recommendedVirtualSensor = undefined;
    this.data.virtualSensorId = virtualSensor.id;
    this.location = virtualSensor.location;
  }
  set recommendedVirtualSensor(virtualSensor) {
    this.data.recommendedVirtualSensor = virtualSensor.toData();
    this.location = virtualSensor.location;
  }

  addRequiredAttribute(att) {
    this.data.requiredAttributes = this.data.requiredAttributes || [];
    this.data.requiredAttributes.push(att);
  }

  addAttribute(name, value) {
    this.data.attributes = this.data.attributes || {};
    this.data.attributes[name] = value;
  }

  sensors() {
    let location = this.location;
    if (location) {
      return _.flatten(location.sensors().filter((locationSensor) => {
        return locationSensor.name == this.sensorType;
      }).map((locationSensor) => {
        return locationSensor.sensors();
      }));
    }

    let device = this.device;
    if (device) {
      return device.sensors.filter((deviceSensor) => {
        return deviceSensor.name == this.sensorType;
      });
    }

    return [];
  }

  devicesWithAction() {
    let location = this.location;
    if (location) {
      return _.flatten(location.actions().filter((locationAction) => {
        return locationAction.name == this.actionType;
      }).map((locationAction) => {
        return locationAction.devices;
      }));
    }

    let device = this.device;
    if (device) {
      return [device];
    }

    return [];
  }

  get referencedVirtualSensor() {
    if (this.data.virtualSensorId && this._model) {
      return this._model.virtualSensors.find((virtualSensor) => {
        return virtualSensor.id == this.data.virtualSensorId;
      });
    }
  }

  get virtualSensor() {
    return this.referencedVirtualSensor || this.recommendedVirtualSensor;
  }

  get location() {
    if (this.data.locationName && this._model) {
      return new Location(this.data.locationName, this._model);
    }
  }

  get device() {
    if (this.data.deviceId && this._model) {
      return this._model.devices.find((device) => {
        return device.id == this.data.deviceId;
      });
    }
  }

  get labels() { return new ConditionOrActionLabels(this); }
  get serviceName() { return this.labels.serviceName(); }
  get sourceName() { return this.labels.sourceName(); }
  get serviceNameWithSource() { return this.labels.serviceNameWithSource(); }
  get name() { return this.labels.name(); }

  describeAttributes() { return this.labels.describeAttributes(); }

  hasChosenService() {
    return (this.data.sensorType || this.data.actionType || this.virtualSensor) ? true : false;
  }
  hasLocation() { return this.data.locationName ? true : false; }
  requiresSensor() { return this.data.sensorType ? true : false; }
  requiresDevice() { return this.data.deviceId ? true : false; }
  requiresReferencedVirtualSensor() { return this.data.virtualSensorId ? true : false; }
  requiresRecommendedVirtualSensor() {
    return (this.data.recommendedVirtualSensor || this.data.recommendedVirtualSensorId) ? true : false;
  }
  requiresVirtualSensor() { return this.requiresReferencedVirtualSensor() || this.requiresRecommendedVirtualSensor(); }
  requiresAction() { return this.data.actionType ? true : false; }

  toData() {
    return this.data;
  }
}

module.exports = ConditionOrAction;
