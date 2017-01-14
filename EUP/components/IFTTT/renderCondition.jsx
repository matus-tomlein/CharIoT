var React = require('react'),

    renderConditionOrAction = require('./renderConditionOrAction.jsx'),
    NewVirtualSensor = require('./NewVirtualSensor.jsx'),
    conditionServices = require('./conditionServices');

function renderCondition(page, model) {
  var children = <NewVirtualSensor model={model} />;
  return renderConditionOrAction(page, model, conditionServices, children);
}

module.exports = renderCondition;
