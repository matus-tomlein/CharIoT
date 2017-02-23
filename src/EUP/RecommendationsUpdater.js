const async = require('async'),

      RecommendationService = require('../Hub/RecommendationService'),
      Repository = require('../Hub/Repository'),
      Model = require('../Model');

class RecommendationsUpdater {
  constructor(api, settings) {
    this.api = api;
    this.settings = settings;
  }

  get model() { return new Model(this.settings.data); }

  update(callback) {
    let friendlyBuildings = this.settings.data.configuration.friendlyBuildings;

    if (friendlyBuildings && friendlyBuildings.length) {
      this._createRepository(friendlyBuildings, (err, repository) => {
        let service = new RecommendationService(this.model.building,
            repository);

        service.recommendRules((err, recommendations) => {
          if (err) { callback(err); return; }

          this.model.recommendations = recommendations;
          this.settings.save(callback);
        });
      });
    } else {
      callback();
    }
  }

  _createRepository(friendlyBuildings, callback) {
    let repository = new Repository();
    repository.addInstallation(this.model.building);

    var q = async.queue((buildingName, done) => {
      this.api.getBuildingModel(buildingName, (err, building) => {
        if (err) { done(err); return; }

        repository.addInstallation(building);
        done();
      });
    }, 5);

    q.drain = (err) => {
      if (err) { callback(err); return; }

      callback(null, repository);
    };

    q.push(friendlyBuildings);
  }
}

module.exports = RecommendationsUpdater;
