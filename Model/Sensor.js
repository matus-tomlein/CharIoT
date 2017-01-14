class Sensor {
  constructor(data, device) {
    this.id = data.id;
    this.name = data.name;
    this.device = device;
  }
}

module.exports = Sensor;
