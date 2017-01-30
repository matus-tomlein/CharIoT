const ConditionOrAction = require('./ConditionOrAction'),
      initializers = require('./conditionOrActionInitializers');

function conditionServices(model) {
  var sensors = [];

  model.virtualSensors.forEach((virtualSensor) => {
    var condition = new ConditionOrAction({}, model);
    condition.virtualSensor = virtualSensor;
    initializers.addVirtualSensorLabelAttribute(condition, virtualSensor);
    sensors.push(condition.data);
  });

  model.recommendedVirtualSensors.forEach((virtualSensor) => {
    var condition = new ConditionOrAction({}, model);
    condition.recommendedVirtualSensor = virtualSensor;
    initializers.addVirtualSensorLabelAttribute(condition, virtualSensor);
    sensors.push(condition.data);
  });

  model.locations.forEach((location) => {
    location.sensors.forEach((sensor) => {
      var condition = new ConditionOrAction({}, model);
      condition.sensorType = sensor.name;
      condition.location = location;
      initializers.addNumericConditionAttribute(condition);
      sensors.push(condition.data);
    });
  });

  model.devices.forEach((device) => {
    device.sensors.forEach((sensor) => {
      var condition = new ConditionOrAction({}, model);
      condition.sensorType = sensor.name;
      condition.device = device;
      initializers.addNumericConditionAttribute(condition);
      sensors.push(condition.data);
    });
  });

  return sensors;
}

module.exports = conditionServices;
