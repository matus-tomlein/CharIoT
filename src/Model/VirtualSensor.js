const generateId = require('./generateId');

class VirtualSensor {
  constructor(data, model) {
    this.data = data || {};
    this.data.id = this.data.id || generateId();
    this._model = model;
  }

  get id() { return this.data.id; }
  get name() { return this.data.name; }
  get samples() { return this.data.samples; }
  get labels() { return this.data.labels; }
  get locationName() { return this.data.location; }
  get sensors() { return this.data.sensors; }
  get location() {
    return this._model.locations.find((loc) => {
      return loc.name == this.locationName;
    });
  }

  set name(name) { this.data.name = name; }
  set samples(samples) { this.data.samples = samples; }
  set labels(labels) { this.data.labels = labels; }
  set locationName(name) { this.data.location = name; }
  set location(location) { this.locationName = location.name; }
  set sensors(sensors) { this.data.sensors = sensors; }

  sensorsByType() {
    var sensorsByType = {};
    var sensorsInLocation = this.location.sensors();

    this.sensors.forEach((sensorType) => {
      var locationSensor = sensorsInLocation.find((sensor) => {
        return sensor.name == sensorType;
      });
      if (locationSensor) {
        sensorsByType[sensorType] = locationSensor.sensors();
      }
    });

    return sensorsByType;
  }

  sensorIdsByType() {
    let sensorsByType = this.sensorsByType();
    let sensorIdsByType = {};
    for (let type in sensorsByType) {
      var sensorIds = sensorsByType[type].map((sensor) => {
        return sensor.id;
      });
      sensorIdsByType[type] = sensorIds;
    }
    return sensorIdsByType;
  }

  averageSampleLength() {
    var lengths = this.samples.map((sample) => {
      return sample.end - sample.start;
    });

    var sum = lengths.reduce((sum, value) => {
      return sum + value;
    }, 0);

    return sum / lengths.length;
  }

  toData() { return this.data; }
}

module.exports = VirtualSensor;
