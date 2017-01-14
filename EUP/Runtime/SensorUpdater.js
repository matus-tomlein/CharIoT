class VirtualSensorUpdater {
  constructor(sensorUuids, api) {
    this.sensorUuids = sensorUuids;
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

    var end = (new Date().getTime() / 1000) - 5; // 5 seconds ago
    var start = end - 10;

    this.api.readTimeseriesOfSensors(this.sensorUuids, start, end, (err, data) => {
      if (!this.running) return;
      if (err) { console.error(err); return; }

      setTimeout(() => {
        this._update(interval, callback);
      }, interval);

      var values = data.map((i) => { return i.value; });
      if (values.length) {
        callback(this._average(values));
      }
    });
  }

  _average(data) {
    var sum = data.reduce(function(sum, value){
      return sum + value;
    }, 0);

    var avg = sum / data.length;
    return avg;
  }
}

module.exports = VirtualSensorUpdater;
