const async = require('async'),
      request = require('request'),

      DataModel = require('../DataModel'),
      Model = require('../Model');

class HubReporter {
  constructor(api, settings) {
    this.api = api;
    this.settings = settings;
  }

  get model() { return new Model(this.settings.data); }

  report(callback) {
    this._createDataModel((err, dataModel) => {
      if (err) { callback(err); return; }

      let hubs = this.settings.data.configuration.hubs;
      if (hubs && hubs.length) {
        if (hubs.length > 1) console.log('More than one hub. Only the first one is being used.');
        let hub = hubs[0];
        var body = {
          id: this.settings.data.userId,
          building: this.settings.data.giotto,
          rules: this.settings.data.input.rules,
          virtualSensors: this.settings.data.input.virtualSensors,
          dataModel: dataModel.toData()
        };

        request({
          url: hub.uri,
          method: 'POST',
          json: body,
          forever: true
        }, (err, response, recommendations) => {
          if (err) {
            callback(err);
          } else {
            this.settings.data.recommended = recommendations;
            callback();
          }
        });
      } else {
        callback();
      }
    });
  }

  _createDataModel(callback) {
    let model = this.model;

    var q = async.queue((sensor, done) => {
      let sensorData = model.sensorDataFor(sensor);
      sensorData.updateIfNecessary(this.api, done);
    }, 5);

    q.drain = (err) => {
      if (err) { callback(err); return; }

      let dataModel = new DataModel(model);
      callback(null, dataModel);
    };

    q.push(model.sensors);
  }
}

module.exports = HubReporter;
