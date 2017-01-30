const async = require('async'),
      request = require('request'),

      DataModel = require('../DataModel'),
      FuzzySet = require('../DataModel/FuzzySet'),
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
      if (hubs.length > 1) console.log('More than one hub. Only the first one is being used.');
      if (hubs && hubs.length) {
        let hub = hubs[0];
        var body = {
          id: this.settings.data.userId,
          devices: this.settings.data.giotto.devices,
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
            this.settings.save();
            callback();
          }
        });
      }
    });
  }

  _createDataModel(callback) {
    let model = this.model;
    let dataModel = new DataModel(model);

    async.each(model.sensors, (sensor, done) => {
      let sensorData = model.sensorDataFor(sensor);
      if (sensorData.hasUpToDateFuzzySetData()) {
        let data = sensorData.fuzzySetData;
        let fuzzySet = new FuzzySet(data);
        dataModel.addSensorFuzzySet(sensor, fuzzySet);
        done();
      }

      else {
        var end = new Date().getTime() / 1000;
        var start = end - (24 * 3600); // 24 hours ago

        this.api.readTimeseries(sensor.id, start, end, (err, data) => {
          if (err) { done(err); }

          if (data.length) {
            let fuzzySet = dataModel.addSensorMeasurements(sensor, data);
            sensor.storeFuzzySetData(fuzzySet.toData());
          }
          done();
        });
      }
    }, (err) => {
      if (err) { callback(err); return; }

      callback(null, dataModel);
    });
  }
}

module.exports = HubReporter;
