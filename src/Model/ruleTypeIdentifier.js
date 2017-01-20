const hash = require('object-hash'),
      _ = require('underscore');

function conditionValues(condition) {
  let values = {};

  values.hasLocation = condition.hasLocation();
  values.requiresDevice = condition.requiresDevice();
  if (condition.requiresSensor()) {
    values.sensor = condition.sensorType;
  }
  if (condition.requiresAction()) {
    values.action = condition.actionType;
  }
  let virtualSensor = condition.virtualSensor || condition.recommendedVirtualSensor;
  if (virtualSensor) {
    values.virtualSensor = {
      name: virtualSensor.name,
      labels: _.sortBy(virtualSensor.labels),
      sensors: _.sortBy(virtualSensor.sensors)
    };
  }
  // values.attributes = condition.attributes;

  return values;
}

module.exports = (rule) => {
  let values = {};

  values.conditions = _.sortBy(rule.conditions.map((condition) => {
    return hash(conditionValues(condition));
  }));

  values.actions = _.sortBy(rule.actions.map((action) => {
    return hash(conditionValues(action));
  }));

  return hash(values);
};
