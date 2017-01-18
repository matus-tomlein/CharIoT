const VirtualSensor = require('../../src/Model/VirtualSensor');

class VirtualSensorFactory {
  constructor(name, labels, model) {
    this.model = model;
    this.virtualSensor = new VirtualSensor({}, model);
    this.virtualSensor.name = name;
    this.virtualSensor.labels = labels;
  }

  set location(locationName) {
    this.virtualSensor.locationName = locationName;
  }

  set sensors(sensors) {
    this.virtualSensor.sensors = sensors;
  }

  save() {
    this.model.addVirtualSensor(this.virtualSensor);
  }
}

module.exports = VirtualSensorFactory;
