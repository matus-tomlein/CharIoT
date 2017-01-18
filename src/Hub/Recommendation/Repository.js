const _ = require('underscore');

class Repository {
  constructor() {
    this._installations = {};
    this._dataModels = {};
  }

  get installations() {
    var keys = Object.keys(this._installations);
    return keys.map((key) => {
      return this._installations[key];
    });
  }

  get dataModels() {
    var keys = Object.keys(this._dataModels);
    return keys.map((key) => {
      return this._dataModels[key];
    });
  }

  addInstallation(installation) {
    this._installations[installation.id] = installation;
  }

  addInstallationDataModel(dataModel) {
    this._dataModels[dataModel.id] = dataModel;
  }

  installationWithId(id) {
    return this._installations[id];
  }

  dataModelWithId(id) {
    return this._dataModels[id];
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
