const ConditionOrAction = require('./ConditionOrAction'),
      initializers = require('./conditionOrActionInitializers');

function conditionServices(model) {
  var sensors = [];

  model.locations.forEach((location) => {

    location.virtualSensorsByType.forEach((virtualSensor) => {
      var condition = new ConditionOrAction({}, model);
      condition.virtualSensor = virtualSensor;
      condition.isRecommended = true;
      initializers.addVirtualSensorLabelAttribute(condition, virtualSensor);
      sensors.push(condition.data);
    });

    location.recommendedVirtualSensorsByType.forEach((virtualSensor) => {
      var condition = new ConditionOrAction({}, model);
      condition.isRecommended = true;
      condition.virtualSensor = virtualSensor;
      initializers.addVirtualSensorLabelAttribute(condition, virtualSensor);
      sensors.push(condition.data);
    });

  });

  return sensors;
}

module.exports = conditionServices;
