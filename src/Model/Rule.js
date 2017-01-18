const ConditionOrAction = require('./ConditionOrAction'),

      generateId = require('./generateId'),
      ruleTypeIdentifier = require('./ruleTypeIdentifier'),
      _ = require('underscore');

class Rule {
  constructor(data, model) {
    this.id = data.id || generateId();
    this.data = data;
    this.model = model;

    this.conditions = (data.conditions || []).map((condition) => {
      return new ConditionOrAction(condition, model);
    });
    this.actions = (data.actions || []).map((action) => {
      return new ConditionOrAction(action, model);
    });
  }

  conditionNames() {
    return this.conditions.map((condition) => { return condition.name; }).join(' and ');
  }

  actionNames() {
    return this.actions.map((action) => { return action.name; }).join(' and ');
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

  addCondition(condition) { this.conditions.push(condition); }
  addAction(action) { this.actions.push(action); }

  get typeId() {
    return ruleTypeIdentifier(this);
  }

  toData() {
    return {
      id: this.id,
      conditions: this.conditions.map((condition) => {
        return condition.toData();
      }),
      actions: this.actions.map((action) => {
        return action.toData();
      })
    };
  }
}

module.exports = Rule;
