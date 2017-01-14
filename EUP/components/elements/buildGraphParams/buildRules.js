const _ = require('underscore');

module.exports = (model, filters, graphParams) => {
  if (filters.showRules) {
    model.rules.forEach((rule) => {
      graphParams.nodes.push({
        id: rule.id,
        icon: 'fa-question-circle',
        label: '',
        css_class: 'node-red'
      });

      var locationIds = [];
      rule.conditions.forEach((condition) => {
        var virtualSensor = condition.virtualSensor();
        var location = condition.location();
        var device = condition.device();
        if (location) {
          locationIds.push(location.id);
        }
        if (device) {
          device.locations.forEach((l) => {
            locationIds.push(l.id);
          });
        }

        if (virtualSensor) {
          graphParams.edges.push({
            from: virtualSensor.id,
            to: rule.id,
            label: condition.describeAttributes(),
            lineInterpolateBasis: false,
            color: '#E9967A',
            dashed: false,
            width: '1.5px',
            arrowhead: 'vee'
          });
        } else {
          var sensor;
          if (location) {
            sensor = location.sensors().find((sensor) => {
              return sensor.name == condition.data.sensorType;
            });
          } else if (device) {
            sensor = device.sensors.find((sensor) => {
              return sensor.name == condition.data.sensorType;
            });
          }

          if (sensor) {
            graphParams.edges.push({
              from: sensor.id,
              to: rule.id,
              label: condition.describeAttributes(),
              lineInterpolateBasis: false,
              color: '#E9967A',
              dashed: false,
              width: '1.5px',
              arrowhead: 'vee'
            });
          }
        }
      });

      rule.actions.forEach((ruleAction) => {
        var location = ruleAction.location();
        var device = ruleAction.device();
        var action;
        if (location) {
          locationIds.push(location.id);

          action = location.actions().find((action) => {
            return action.name == ruleAction.data.actionType;
          });
        } else if (device) {
          device.locations.forEach((l) => {
            locationIds.push(l.id);
          });

          action = device.actions.find((action) => {
            return action.name == ruleAction.data.actionType;
          });
        }

        if (action) {
          graphParams.edges.push({
            from: rule.id,
            to: action.id,
            label: ruleAction.describeAttributes(),
            lineInterpolateBasis: false,
            color: '#87A980',
            dashed: false,
            width: '1.5px',
            arrowhead: 'vee'
          });
        }
      });

      if (_.uniq(locationIds).length == 1) {
        graphParams.placements.push({
          of: rule.id,
          in: locationIds[0]
        });
      }
    });
  }
};
