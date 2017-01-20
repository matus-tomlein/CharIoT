const _ = require('underscore'),

      RuleGenerator = require('./Recommendation/RuleGenerator'),
      SensorSimilarityRanking = require('./Recommendation/SensorSimilarityRanking');

class RecommendationService {
  constructor(installation, repository) {
    this.installation = installation;
    this.repository = repository;
  }

  recommendRules(callback) {
    let ruleGenerator = new RuleGenerator(this.repository, this.installation);
    ruleGenerator.generate((err, rules) => {
      if (err) { callback(err); return; }

      let ranker = new SensorSimilarityRanking(rules, this.repository);
      ranker.rank((err, ranks) => {
        if (err) { callback(err); return; }

        let rankedRules = [];
        for (let typeId in ranks) {
          rankedRules.push(ranks[typeId]);
        }

        rankedRules = _.sortBy(rankedRules, (item) => { return item.rank * -1; });
        rankedRules = rankedRules.map((item) => {
          return rules.find((rule) => {
            return rule.id == item.ruleId;
          });
        });

        callback(null, rankedRules);
      });
    });
  }
}

module.exports = RecommendationService;
