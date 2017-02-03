class SensorData {
  constructor(sensor, model) {
    this.sensor = sensor;
    this.model = model;
  }

  get id() { return this.sensor.id; }

  get sensorData() {
    if (this.model && this.model.data.sensorData &&
        this.model.data.sensorData[this.id]) {
      return this.model.data.sensorData[this.id];
    }
  }

  get fuzzySetData() {
    let sensorData = this.sensorData;
    return sensorData.fuzzySetData;
  }

  get fuzzySetDataStoredAt() {
    let sensorData = this.sensorData;
    if (sensorData) {
      return sensorData.storedAt;
    }
  }

  storeFuzzySetData(fuzzySetData) {
    let model = this.model;
    if (model) {
      if (!model.data.sensorData) { model.data.sensorData = {}; }

      model.data.sensorData[this.id] = {
        fuzzySetData: fuzzySetData,
        storedAt: new Date()
      };
    }
  }

  hasUpToDateFuzzySetData() {
    if (!this.fuzzySetDataStoredAt) return false;

    let hourDifference = (new Date() - new Date(this.fuzzySetDataStoredAt)) / (60 * 60 * 1000);
    return hourDifference < 48;
  }

  updateIfNecessary(api, callback) {
    const DataModel = require('../DataModel'),
          FuzzySet = require('../DataModel/FuzzySet');

    let dataModel = new DataModel(this.model);

    if (this.hasUpToDateFuzzySetData()) {
      console.log('Using cached data model for ', this.sensor.uuid);
      let data = this.fuzzySetData;
      let fuzzySet = new FuzzySet(data);
      dataModel.addSensorFuzzySet(this.sensor, fuzzySet);
      callback();
    }

    else {
      console.log('Fetching new data model for ', this.sensor.uuid);
      var end = new Date().getTime() / 1000;
      var start = end - (24 * 3600); // 24 hours ago

      api.readTimeseries(this.sensor.uuid, start, end, (err, data) => {
        if (err) { callback(err); return; }

        if (data.length) {
          let fuzzySet = dataModel.addSensorMeasurements(this.sensor, data);
          this.storeFuzzySetData(fuzzySet.toData());
        }
        callback();
      });
    }
  }
}

module.exports = SensorData;
