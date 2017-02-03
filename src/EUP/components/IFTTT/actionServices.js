const ConditionOrAction = require('./ConditionOrAction'),
      initializers = require('./conditionOrActionInitializers');

function actionServices(model) {
  let actions = [];

  let create = (action) => {
    let condition = new ConditionOrAction({}, model);
    console.log(action);
    condition.actionType = action.name;
    if (action.options) {
      initializers.addActionOptionsAttribute(condition, action);
    }
    return condition;
  };

  model.locations.forEach((location) => {
    location.actions.forEach((action) => {
      let condition = create(action);
      condition.location = location;
      initializers.addLocationScopeAttribute(condition, location);
      actions.push(condition.data);
    });
  });

  model.devices.forEach((device) => {
    device.actions.forEach((action) => {
      let condition = create(action);
      condition.device = device;
      actions.push(condition.data);
    });
  });

  return actions;
}

module.exports = actionServices;
