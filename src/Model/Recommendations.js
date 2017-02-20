const chariotModel = require('../chariotModel'),
      Rule = chariotModel.Rule,
      VirtualSensor = chariotModel.VirtualSensor;

class Recommendations {
  constructor(data, model) {
    this.model = model;
    this.data = data;
    this.data.rules = this.data.rules || {};
    this.data.rulesBySensorSimilarity = this.data.rulesBySensorSimilarity || [];
    this.data.relatedRules = this.data.relatedRules || {};
    this.data.virtualSensors = this.data.virtualSensors || [];
  }

  get rulesBySensorSimilarity() {
    return this.data.rulesBySensorSimilarity.map((ruleId) => {
      return this.ruleWithId(ruleId);
    });
  }

  get virtualSensors() {
    return this.data.virtualSensors.map((vs) => {
      return new VirtualSensor(vs, this.model);
    });
  }

  ruleWithId(ruleId) { return new Rule(this.data.rules[ruleId], this.model); }

  rulesRelatedToRule(rule) {
    let rules =  this.data.relatedRules[rule.id];
    if (rules) return rules.map((ruleId) => { return this.ruleWithId(ruleId); });
    return [];
  }

  rulesRelatedToDevice(device) {
    let rules = this.data.relatedRules[device.name];
    if (rules) return rules.map((ruleId) => { return this.ruleWithId(ruleId); });
    return [];
  }

  addRule(rule) {
    if (!this.data.rules[rule.id]) {
      let ruleData = JSON.parse(JSON.stringify(rule.toData()));
      ruleData.conditions.forEach((condition) => {
        if (condition.recommendedVirtualSensor) {
          let virtualSensor = condition.recommendedVirtualSensor;
          this._addVirtualSensorData(virtualSensor);
          condition.recommendedVirtualSensor = undefined;
          condition.recommendedVirtualSensorId = virtualSensor.id;
        }
      });
      this.data.rules[rule.id] = ruleData;
    }
  }

  _addVirtualSensorData(virtualSensorData) {
    let exists = this.data.virtualSensors.find((vs) => {
      return vs.id == virtualSensorData.id;
    });
    if (!exists) {
      this.data.virtualSensors.push(virtualSensorData);
    }
  }

  addRulesRankedBySensorSimilarity(rules) {
    rules.forEach((rule) => { this.addRule(rule); });
    this.data.rulesBySensorSimilarity = rules.map((rule) => {
      return rule.id;
    });
  }

  addRelatedRulesToRule(rule, related) {
    this.data.relatedRules[rule.id] = related.map((relatedRule) => {
      this.addRule(relatedRule);
      return relatedRule.id;
    });
  }

  addRelatedRulesToDevice(deviceName, rules) {
    this.data.relatedRules[deviceName] = rules.map((rule) => {
      this.addRule(rule);
      return rule.id;
    });
  }

  toData() { return this.data; }
}

module.exports = Recommendations;
