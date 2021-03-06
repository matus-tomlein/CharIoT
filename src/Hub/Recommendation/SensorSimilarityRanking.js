const _ = require('underscore');

class SensorSimilarityRanking {
  constructor(rules, repository) {
    this.rules = rules;
    this.repository = repository;
  }

  rank(callback) {
    let ranksByType = {};
    this.rules.forEach((rule) => {
      let installationId = rule.building.id;
      let relatedRules = this._allOtherRulesWithType(rule, installationId);

      if (relatedRules.length) {
        let ranks = relatedRules.map((relatedRule) => {
          return this._rankSimilarityOfRule(rule, relatedRule);
        });

        let rank = _.max(ranks);
        if (ranksByType[rule.typeId]) {
          if (rank >= ranksByType[rule.typeId].rank) {
            ranksByType[rule.typeId] = {
              rank: rank,
              ruleId: rule.id
            };
          }
        } else {
          ranksByType[rule.typeId] = {
            rank: rank,
            ruleId: rule.id
          };
        }
      } else {
        ranksByType[rule.typeId] = {
          rank: 0,
          ruleId: rule.id
        };
      }
    });

    callback(null, ranksByType);
  }

  _allOtherRulesWithType(ofRule, exceptInstallationId) {
    let type = ofRule.typeIdWithAttributes;
    return _.flatten(this.repository.installations.filter((installation) => {
      return installation.id != exceptInstallationId;
    }).map((installation) => {
      return installation.rules.filter((rule) => {
        return rule.typeIdWithAttributes == type;
      });
    }));
  }

  _rankSimilarityOfRule(ruleA, ruleB) {
    let sensorsByTypeA = this._sensorsUsedByRule(ruleA);
    let sensorsByTypeB = this._sensorsUsedByRule(ruleB);
    let ranks = [];

    for (let key in sensorsByTypeA) {
      if (sensorsByTypeB[key]) {
        let sensorsA = sensorsByTypeA[key];
        let sensorsB = sensorsByTypeB[key];

        let sensorsToFuzzySet = (sensors) => {
          let fuzzySets = sensors.map((sensor) => {
            let data = sensor.sensorData;
            return data.available ? data.fuzzySet : null;
          }).filter((fs) => { return fs; });

          if (fuzzySets.length) {
            return fuzzySets.reduce((set1, set2) => { set1.combineWith(set2); return set1; });
          }
        };

        let fuzzySetA = sensorsToFuzzySet(sensorsA);
        let fuzzySetB = sensorsToFuzzySet(sensorsB);

        if (fuzzySetA && fuzzySetB) {
          ranks.push(fuzzySetA.similarityToOtherFuzzySet(fuzzySetB));
        }
      }
    }

    if (ranks.length) {
      let ranksSum = ranks.reduce((total, item) => { return total + item; });
      return ranksSum / ranks.length;
    }

    return 0;
  }

  _sensorsUsedByRule(rule) {
    let sensorsByType = {};
    let addSensorsWithType = (type, sensors) => {
      if (sensorsByType[type]) {
        sensorsByType[type] = _.uniq(sensorsByType[type].concat(sensors));
      } else {
        sensorsByType[type] = sensors;
      }
    };

    rule.conditions.forEach((condition) => {
      if (condition.requiresVirtualSensor()) {
        condition.virtualSensors.forEach((vs) => {
          vs.sensors.forEach((sensor) => {
            addSensorsWithType(sensor.name, [sensor]);
          });
        });
      }
    });

    return sensorsByType;
  }
}

module.exports = SensorSimilarityRanking;
