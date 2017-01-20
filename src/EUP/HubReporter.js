const async = require('async'),
      _ = require('underscore'),
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

      async.map(this.settings.data.configuration.hubs || [], (hub, done) => {
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
        }, function (err, response, body) {
          if (err) {
            done(err);
          } else {
            done(null, body.rules);
          }
        });
      }, (err, rules) => {
        if (err) {
          callback(err);
        } else {
          rules = _.flatten(rules);
          this._extractVirtualSensorsFromRules(rules, (rules, virtualSensors) => {
            this.settings.data.recommended = {
              rules: rules,
              virtualSensors: virtualSensors
            };
            this.settings.save();
            callback();
          });
        }
      });
    });
  }

  _createDataModel(callback) {
    let model = this.model;
    let dataModel = new DataModel(model);

    async.each(model.sensors, (sensor, done) => {
      if (sensor.hasUpToDateFuzzySetData()) {
        let data = sensor.fuzzySetData;
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

  _extractVirtualSensorsFromRules(rules, callback) {
    let virtualSensors = [];
    rules = rules.map((rule) => {
      rule.conditions.forEach((condition) => {
        if (condition.recommendedVirtualSensor) {
          let virtualSensor = condition.recommendedVirtualSensor;
          virtualSensors.push(virtualSensor);
          condition.recommendedVirtualSensor = undefined;
          condition.recommendedVirtualSensorId = virtualSensor.id;
        }
      });
      return rule;
    });

    callback(rules, virtualSensors);
  }
}

module.exports = HubReporter;
