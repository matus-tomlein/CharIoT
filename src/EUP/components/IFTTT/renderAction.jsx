var React = require('react'),

    renderConditionOrAction = require('./renderConditionOrAction.jsx'),
    actionServices = require('./actionServices');

function renderAction(page, model) {
  return renderConditionOrAction(page, model, actionServices);
}

module.exports = renderAction;
