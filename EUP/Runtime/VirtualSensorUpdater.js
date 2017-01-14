class VirtualSensorUpdater {
  constructor(virtualSensorInfo, api) {
    this.virtualSensorInfo = virtualSensorInfo;
    this.api = api;
    this.running = false;
  }

  start(callback) {
    this.running = true;
    this._update(5000, callback);
  }

  stop() {
    this.running = false;
    this.virtualSensor = null;
  }

  _update(interval, callback) {
    if (!this.running) return;
    if (!this.virtualSensorInfo.samples ||
        this.virtualSensorInfo.samples.length == 0) return;

    var continueAfterTraining = (err) => {
      if (!this.running) return;
      if (err) { console.error(err); return; }

      this._predict((err, label) => {
        if (!this.running) return;

        setTimeout(() => {
          this._update(interval, callback);
        }, interval);

        if (err) { console.error(err); return; }

        callback(label);
      });
    };

    if (!this.virtualSensor) {
      this.virtualSensor = this.api.virtualSensor();
      this._train(continueAfterTraining);
    } else {
      continueAfterTraining();
    }
  }

  _train(callback) {
    this.virtualSensorInfo.samples.forEach((sample) => {
      var sensorIdsByType = sample.sensors;
      var uuids = this.virtualSensorInfo.sensors.map((sensorType) => {
        return sensorIdsByType[sensorType];
      });

      this.virtualSensor.addSample(uuids,
          sample.start,
          sample.end,
          sample.label);
    });

    this.virtualSensor.train(callback);
  }

  _predict(callback) {
    var predictEnd = (new Date().getTime() / 1000) - 5; // 5 seconds ago
    var predictStart = predictEnd - this.virtualSensorInfo.averageSampleLength();

    var sensorIdsByType = this.virtualSensorInfo.sensorIdsByType();
    var uuids = this.virtualSensorInfo.sensors.map((sensorType) => {
      return sensorIdsByType[sensorType];
    });

    this.virtualSensor.predict(uuids, predictStart, predictEnd, callback);
  }
}

module.exports = VirtualSensorUpdater;
