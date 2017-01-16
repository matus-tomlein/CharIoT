const _ = require('underscore');

class Repository {
  constructor() {
    this._installations = {};
  }

  get installations() {
    var keys = Object.keys(this._installations);
    return keys.map((key) => {
      return this._installations[key];
    });
  }

  addInstallation(installation) {
    this._installations[installation.id] = installation;
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
