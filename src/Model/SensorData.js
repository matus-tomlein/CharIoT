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
}

module.exports = SensorData;
