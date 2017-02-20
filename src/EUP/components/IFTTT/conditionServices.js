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

  return sensors;
}

module.exports = conditionServices;
