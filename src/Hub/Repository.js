const _ = require('underscore'),

      RelatedRules = require('./Recommendation/RelatedRules'),
      chariotModel = require('../chariotModel'),
      Building = chariotModel.Building;

class Repository {
  constructor() {
    this._installations = {};
    this.relatedRules = new RelatedRules();
  }

  get installations() {
    var keys = Object.keys(this._installations);
    return keys.map((key) => {
      return this._installationFromData(this._installations[key]);
    });
  }

  addInstallation(installation) {
    this.relatedRules.addRulesFromInstallation(installation);
    this._installations[installation.id] = JSON.stringify(installation.data);
  }

  installationWithId(id) {
    return this._installationFromData(this._installations[id]);
  }

  _installationFromData(data) {
    if (data) { return new Building(JSON.parse(data)); }
  }

  get virtualSensors() {
    return _.flatten(this.installations.map((installation) => {
      return installation.virtualSensors;
    }));
  }

  get rules() {
    return _.flatten(this.installations.map((installation) => {
      return installation.rules;
    }));
  }
}

module.exports = Repository;
