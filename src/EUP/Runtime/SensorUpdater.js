class SensorUpdater {
  constructor(sensorUuids, api) {
    this.sensorUuids = sensorUuids;
    this.api = api;
    this.running = false;
  }

  start(callback) {
    this.running = true;
    this.subscription = this.api.subscribeToSensors(this.sensorUuids, callback);
    this.subscription.averageValues = true;
  }

  stop() {
    this.running = false;
    if (this.subscription) {
      this.subscription.stop();
      this.subscription = undefined;
    }
  }
}

module.exports = SensorUpdater;
