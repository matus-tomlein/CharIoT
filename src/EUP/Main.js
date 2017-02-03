const GIoTTOApi = require('../../../giotto-api'),
      HubReporter = require('./HubReporter'),
      Model = require('./Model'),
      Runtime = require('./Runtime'),

      Settings = require('../Helpers').Settings;

class Main {
  constructor() {
    var blankData = Model.blankData;
    blankData.userId = Math.random().toString(36);
    this.settings = new Settings(__dirname + '/' + this.sessionName + '.json', blankData);
  }

  get model() { return new Model(this.settings.data); }
  get credentials() { return this.model.credentials; }
  get isLoggedIn() { return this.giottoApi; }

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

        if (this.credentials) {
          this._login(callback);
        } else {
          callback();
        }
      });
    });
  }

  login(giottoCredentials, callback) {
    console.log('logging in', giottoCredentials);
    this.model.credentials = giottoCredentials;
    this.settings.save((err) => {
      if (err) { console.log(err); return; }
      this._login(callback);
    });
  }

  _login(callback) {
    let api = new GIoTTOApi(this.credentials);

    api.authenticate((err) => {
      if (err) { callback(err); return; }

      this.giottoApi = api;

      this.runtime = new Runtime(this.giottoApi);
      if (err) { callback(err); return; }

      this.refresh((err) => {
        if (err) { callback(err); return; }

        callback();
      });
    });
  }

  refresh(callback) {
    if (!this.isLoggedIn) { callback('Not logged in'); return; }
    if (this.runtime) this.runtime.reset();

    this.giottoApi.getBuildingModel(this.credentials.building, (err, building) => {
      if (err) { callback(err); return; }

      this.settings.data.giotto = JSON.parse(JSON.stringify(building.data));

      if (this.runtime) this.runtime.start(this.model);

      var hubReporter = new HubReporter(this.giottoApi, this.settings);
      hubReporter.report((err) => {
        if (err) { callback(err); return; }

        this.settings.save((err) => {
          if (err) { callback(err); return; }

          callback();
        });
      });
    });
  }
}

module.exports = Main;
