const _ = require('underscore'),
      Combinatorics = require('js-combinatorics');

class RelatedRules {
  constructor() {
    this.ruleRelations = {};
  }

  addRulesFromInstallation(installation) {
    let rules = installation.rules;
    if (rules.length < 2) { return; }
    let combinations = Combinatorics.combination(rules, 2);
    let comb;
    while (comb = combinations.next()) {
      this.addRelation(comb[0].typeId, comb[1].typeId);
      this.addRelation(comb[1].typeId, comb[0].typeId);
    }

    rules.forEach((rule) => {
      let deviceTypes = rule.usedDevices().map((device) => { return device.type; });
      _.uniq(deviceTypes).forEach((deviceType) => {
        this.addRelation(deviceType, rule.typeId);
      });
    });
  }

  addRelation(type1, type2) {
    if (this.ruleRelations[type1]) {
      this.ruleRelations[type1].push(type2);
    } else {
      this.ruleRelations[type1] = [ type2 ];
    }
  }

  recommendRelatedRules(rule, rules) {
    return this.getRelatedRules(rule.typeId, rules);
  }

  recommendRelatedRulesForDevice(deviceType, rules) {
    return this.getRelatedRules(deviceType, rules);
  }

  getRelatedRules(toType, rules) {
    let ruleTypes = this.ruleRelations[toType];
    if (!ruleTypes) { return []; }

    let typeCounts = {};

    ruleTypes.forEach((type) => {
      if (typeCounts[type]) typeCounts[type]++;
      else typeCounts[type] = 1;
    });

    let types = Object.keys(typeCounts).map((type) => {
      return [ type, typeCounts[type] ];
    });
    let sorted = _.sortBy(types, (type) => { return -1 * type[1]; });
    ruleTypes = sorted.map((type) => { return type[0]; });

    return _.flatten(ruleTypes.map((type) => {
      return rules.filter((rule) => {
        return rule.typeId == type;
      });
    }));
  }
}

module.exports = RelatedRules;
