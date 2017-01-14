class VirtualSensor {
  constructor(data, model) {
    this.id = data.id;
    this.name = data.name;
    this.samples = data.samples;
    this.labels = data.labels;
    this.locationName = data.location;
    this.sensors = data.sensors;
    this._model = model;
  }

  location() {
    return this._model.locations().find((loc) => {
      return loc.name == this.locationName;
    });
  }

  sensorIdsByType() {
    var idsByType = {};
    var sensorsInLocation = this.location().sensors();

    this.sensors.forEach((sensorType) => {
      var locationSensor = sensorsInLocation.find((sensor) => {
        return sensor.name == sensorType;
      });
      if (locationSensor) {
        var sensorIds = locationSensor.sensors().map((sensor) => {
          return sensor.id;
        });

        idsByType[sensorType] = sensorIds;
      }
    });

    return idsByType;
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
}

module.exports = VirtualSensor;
