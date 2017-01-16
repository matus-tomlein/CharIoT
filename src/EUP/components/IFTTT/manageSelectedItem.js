const _ = require('underscore');

module.exports = {
  get: (page) => {
    if (page.state.selectedConditionId) {
      return page.state.conditions.find((cond) => {
        return cond.id == page.state.selectedConditionId;
      });
    }

    else if (page.state.selectedActionId) {
      return page.state.actions.find((act) => {
        return act.id == page.state.selectedActionId;
      });
    }
  },

  update: (item, page) => {
    if (page.state.selectedConditionId) {
      var conditions = page.state.conditions;
      conditions = _.reject(conditions, (cond) => {
        return cond.id == item.id;
      });
      conditions.push(item);

      page.setState({ conditions: conditions });
    }

    else if (page.state.selectedActionId) {
      var actions = page.state.actions;
      actions = _.reject(actions, (act) => {
        return act.id == item.id;
      });
      actions.push(item);

      page.setState({ actions: actions });
    }
  },

  remove: (page) => {
    if (page.state.selectedConditionId) {
      var conditions = page.state.conditions;
      conditions = _.reject(conditions, (cond) => {
        return cond.id == page.state.selectedConditionId;
      });

      page.setState({ selectedConditionId: null, conditions: conditions });
    }

    else if (page.state.selectedActionId) {
      var actions = page.state.actions;
      actions = _.reject(actions, (act) => {
        return act.id == page.state.selectedActionId;
      });

      page.setState({ selectedActionId: null, actions: actions });
    }
  }
};
