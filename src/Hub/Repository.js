const _ = require('underscore'),

      Model = require('../Model'),
      DataModel = require('../DataModel');

class Repository {
  constructor() {
    this._installations = {};
    this._dataModels = {};
  }

  get installations() {
    var keys = Object.keys(this._installations);
    return keys.map((key) => {
      return this._installationFromData(this._installations[key]);
    });
  }

  get dataModels() {
    var keys = Object.keys(this._dataModels);
    return keys.map((key) => {
      return this._dataModelFromData(this._dataModels[key]);
    });
  }

  addInstallation(installation) {
    this._installations[installation.id] = JSON.stringify(installation.data);
  }

  addInstallationDataModel(dataModel) {
    this._dataModels[dataModel.id] = JSON.stringify(dataModel.toData());
  }

  installationWithId(id) {
    return this._installationFromData(this._installations[id]);
  }

  dataModelWithId(id) {
    return this._dataModelFromData(this._dataModels[id]);
  }

  _installationFromData(data) {
    if (data) { return new Model(JSON.parse(data)); }
  }

  _dataModelFromData(data) {
    if (data) {
      let parsed = JSON.parse(data);
      return DataModel.fromData(parsed, this.installationWithId(parsed.id));
    }
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
