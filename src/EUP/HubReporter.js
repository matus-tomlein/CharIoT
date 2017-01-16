const async = require('async'),
      _ = require('underscore'),
      request = require('request');

class HubReporter {
  constructor(settings) {
    this.settings = settings;
  }

  report(callback) {
    async.map(this.settings.data.configuration.hubs || [], (hub, done) => {
      var body = {
        devices: this.settings.data.giotto.devices,
        rules: this.settings.data.input.rules
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
        this.settings.data.recommended = {
          rules: _.flatten(rules)
        };
        this.settings.save();
        callback();
      }
    });
  }
}

module.exports = HubReporter;
