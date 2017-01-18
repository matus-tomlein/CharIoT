const FuzzySet = require('./SensorSimilarityRanking/FuzzySet');

class InstallationDataModel {
  constructor(installation) {
    this.id = installation.id;
    this.sensorFuzzySets = {};
  }

  addSensorMeasurements(sensor, measurements) {
    let values = measurements.map((item) => { return item.value; });
    this.sensorFuzzySets[sensor.id] = FuzzySet.fromSensorValues(values, sensor.min, sensor.max);
  }

  hasFuzzySetForSensor(sensor) {
    return this.sensorFuzzySets[sensor.id] ? true : false;
  }

  sensorFuzzySet(sensor) {
    return this.sensorFuzzySets[sensor.id];
  }

  toData() {
    let sets = {};
    for (let key in this.sensorFuzzySets) {
      sets[key] = this.sensorFuzzySets[key].toData();
    }
    return {
      sensorFuzzySets: sets
    };
  }
}

module.exports = InstallationDataModel;
