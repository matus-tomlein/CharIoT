var RuleExecution = require('./RuleExecution');

class Runtime {
  constructor(api) {
    this.api = api;
    this.ruleExecutions = [];
    this.running = false;
  }

  installRule(rule) {
    var ruleExecution = new RuleExecution(rule, this);
    this.ruleExecutions.push(ruleExecution);
  }

  start(model) {
    this.running = true;

    model.rules.forEach((rule) => {
      this.installRule(rule);
    });
  }

  reset() {
    if (!this.running) return;
    this.running = false;

    this.ruleExecutions = [];
    this.sensorUpdaters = [];
  }

  virtualSensorUpdated(virtualSensorId, value) {
    if (this.running) {
      this.ruleExecutions.forEach((ruleExecution) => {
        ruleExecution.sensorValueUpdated(virtualSensorId, value);
      });
    }
  }
}

module.exports = Runtime;
