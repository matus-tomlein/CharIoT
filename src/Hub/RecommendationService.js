const _ = require('underscore'),

      RuleGenerator = require('./Recommendation/RuleGenerator'),
      SensorSimilarityRanking = require('./Recommendation/SensorSimilarityRanking'),
      Recommendations = require('../Model/Recommendations');

class RecommendationService {
  constructor(installation, repository) {
    this.installation = installation;
    this.repository = repository;
    this.recommendations = new Recommendations({}, this.installation);
  }

  findRelatedRules(rules) {
    let relatedRules = this.repository.relatedRules;
    this.installation.rules.forEach((rule) => {
      let related = relatedRules.recommendRelatedRules(rule, rules);
      this.recommendations.addRelatedRulesToRule(rule, related);
    });

    let deviceNames = _.uniq(this.installation.devices.map((d) => { return d.name; }));
    deviceNames.forEach((deviceName) => {
      let related = relatedRules.recommendRelatedRulesForDevice(deviceName, rules);
      this.recommendations.addRelatedRulesToDevice(deviceName, related);
    });
  }

  recommendRules(callback) {
    let ruleGenerator = new RuleGenerator(this.repository, this.installation);
    ruleGenerator.generate((err, generatedRules) => {
      if (err) { callback(err); return; }

      let ranker = new SensorSimilarityRanking(generatedRules, this.repository);
      ranker.rank((err, ranks) => {
        if (err) { callback(err); return; }

        let rankedRules = [];
        for (let typeId in ranks) {
          rankedRules.push(ranks[typeId]);
        }

        rankedRules = _.sortBy(rankedRules, (item) => { return item.rank * -1; });
        rankedRules = rankedRules.map((item) => {
          return generatedRules.find((rule) => {
            return rule.id == item.ruleId;
          });
        });

        this.recommendations.addRulesRankedBySensorSimilarity(rankedRules);
        this.findRelatedRules(generatedRules);

        callback(null, this.recommendations);
      });
    });
  }
}

module.exports = RecommendationService;
