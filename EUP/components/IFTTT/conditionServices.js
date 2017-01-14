const ConditionOrAction = require('./ConditionOrAction'),
      initializers = require('./conditionOrActionInitializers');

function conditionServices(model) {
  var sensors = [];

  model.virtualSensors.forEach((virtualSensor) => {
    var condition = new ConditionOrAction({}, model);
    condition.setVirtualSensor(virtualSensor);
    initializers.addVirtualSensorLabelAttribute(condition, virtualSensor);
    sensors.push(condition.data);
  });

  model.locations().forEach((location) => {
    location.sensors().forEach((sensor) => {
      var condition = new ConditionOrAction();
      condition.setFromSensorType(sensor.name);
      condition.setInLocation(location);
      initializers.addNumericConditionAttribute(condition);
      sensors.push(condition.data);
    });
  });

  model.devices.forEach((device) => {
    device.sensors.forEach((sensor) => {
      var condition = new ConditionOrAction();
      condition.setFromSensorType(sensor.name);
      condition.setDevice(device);
      initializers.addNumericConditionAttribute(condition);
      sensors.push(condition.data);
    });
  });

  return sensors;
}

module.exports = conditionServices;
