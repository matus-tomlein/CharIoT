const hash = require('object-hash'),
      _ = require('underscore');

function conditionValues(condition, includeAttributes) {
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

  if (includeAttributes) {
    values.attributes = condition.attributes;
  }

  return values;
}

module.exports = (rule, includeAttributes) => {
  let values = {};

  values.conditions = _.sortBy(rule.conditions.map((condition) => {
    return hash(conditionValues(condition, includeAttributes));
  }));

  values.actions = _.sortBy(rule.actions.map((action) => {
    return hash(conditionValues(action, includeAttributes));
  }));

  return hash(values);
};
