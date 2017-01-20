const FuzzySet = require('./FuzzySet');

class InstallationDataModel {
  static fromData(data, installation) {
    let dataModel = new InstallationDataModel(installation);
    for (var sensorId in data.sensorFuzzySets) {
      dataModel.sensorFuzzySets[sensorId] = new FuzzySet(data.sensorFuzzySets[sensorId]);
    }
    return dataModel;
  }

  constructor(installation) {
    this.id = installation.id;
    this.sensorFuzzySets = {};
  }

  addSensorMeasurements(sensor, measurements) {
    let values = measurements.map((item) => { return item.value; });
    let fuzzySet = FuzzySet.fromSensorValues(values, sensor.min, sensor.max);
    this.addSensorFuzzySet(sensor, fuzzySet);
    return fuzzySet;
  }

  addSensorFuzzySet(sensor, fuzzySet) {
    this.sensorFuzzySets[sensor.id] = fuzzySet;
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
      id: this.id,
      sensorFuzzySets: sets
    };
  }
}

module.exports = InstallationDataModel;
