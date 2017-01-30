var HubReporter = require('./HubReporter'),
    Model = require('./Model'),
    Runtime = require('./Runtime'),

    Settings = require('../Helpers').Settings;

class Main {
  constructor() {
    var blankData = Model.blankData;
    blankData.userId = Math.random().toString(36);
    this.settings = new Settings(__dirname + '/' + this.sessionName + '.json', blankData);
    this.giottoApi = require('../api');
  }

  get model() { return new Model(this.settings.data); }

  get sessionName() {
    var sessionName = 'default';
    if (process.argv.length > 2) {
      sessionName = process.argv[2];
    }
    return sessionName;
  }

  initialize(callback) {
    this.settings.load(() => {
      this.settings.save((err) => {
        if (err) { callback(err); return; }

        this.giottoApi.authenticate((err) => {
          if (err) { callback(err); return; }

          this.runtime = new Runtime(this.giottoApi);
          if (err) { callback(err); return; }

          this.refresh((err) => {
            if (err) { callback(err); return; }

            callback();
          });
        });
      });
    });
  }

  refresh(callback) {
    if (this.runtime) this.runtime.reset();

    this.giottoApi.getBuildingModel('My Home', (err, building) => {
      if (err) { callback(err); return; }

      this.settings.giotto = building.data;

      if (this.runtime) this.runtime.start(this.model);

      var hubReporter = new HubReporter(this.giottoApi, this.settings);
      hubReporter.report((err) => {
        if (err) { callback(err); return; }

        this.settings.save();
        callback();
      });
    });
  }
}

module.exports = Main;
