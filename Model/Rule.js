const ConditionOrAction = require('./ConditionOrAction'),
      _ = require('underscore');

class Rule {
  constructor(data, model) {
    this.id = data.id;
    this.data = data;

    this.conditions = (data.conditions || []).map((condition) => {
      return new ConditionOrAction(condition, model);
    });
    this.actions = (data.actions || []).map((action) => {
      return new ConditionOrAction(action, model);
    });
  }

  conditionNames() {
    return this.conditions.map((condition) => { return condition.name(); }).join(' and ');
  }

  actionNames() {
    return this.actions.map((action) => { return action.name(); }).join(' and ');
  }

  name() {
    return 'if ' +
      this.conditionNames() +
      ' then ' +
      this.actionNames();
  }

  locationNames() {
    return _.uniq(this.conditions.map((condition) => {
      return condition.data.locationName;
    }).concat(this.actions.map((action) => {
      return action.data.locationName;
    }).filter((location) => { return location; })));
  }

  sensorTypes() {
    return _.uniq(this.conditions.map((condition) => {
      return condition.data.sensorType;
    }).filter((sensor) => { return sensor; }));
  }

  actionTypes() {
    return _.uniq(this.actions.map((action) => {
      return action.data.actionType;
    }).filter((action) => { return action; }));
  }
}

module.exports = Rule;
