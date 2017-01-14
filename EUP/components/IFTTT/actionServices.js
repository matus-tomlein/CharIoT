const ConditionOrAction = require('./ConditionOrAction'),
      initializers = require('./conditionOrActionInitializers');

function actionServices(model) {
  var actions = [];

  model.locations().forEach((location) => {
    location.actions().forEach((action) => {
      var condition = new ConditionOrAction();
      condition.setFromActionType(action.name);
      condition.setInLocation(location);
      initializers.addLocationScopeAttribute(condition, location);
      actions.push(condition.data);
    });
  });

  model.devices.forEach((device) => {
    device.actions.forEach((action) => {
      var condition = new ConditionOrAction();
      condition.setFromActionType(action.name);
      condition.setDevice(device);
      actions.push(condition.data);
    });
  });

  return actions;
}

module.exports = actionServices;
