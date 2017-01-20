const randgen = require('randgen'),
      rnorm = randgen.rnorm,

      Device = require('../../src/Model/Device'),
      Sensor = require('../../src/Model/Sensor'),
      Action = require('../../src/Model/Action'),
      Location = require('../../src/Model/Location');

class SensortagDeviceFactory {
  constructor(location, model, installationFactory) {
    this.device = new Device({ name: 'sensortag' }, model);

    [
      { min: 0, max: 100, name: 'Temperature' },
      { min: 0, max: 100, name: 'Humidity' },
      { min: 0, max: 300, name: 'Lux' },
      { min: 0, max: 200, name: 'Pressure' }
    ].forEach((data) => {
      let sensor = new Sensor(data, this.device);
      this.device.addSensor(sensor);
    });

    [ 'Buzzer', 'Red LED', 'Green LED', 'Blue LED' ].forEach((actionName) => {
      let action = new Action({ name: actionName }, this.device);
      this.device.addAction(action);
    });

    this.device.addLocation(new Location(location, model));

    this.installation = installationFactory;
    this.model = model;
  }

  meetingRoom() {
    this.installation.generateSensorData(this.device, 'Temperature', () => { return rnorm(20, 5); });
    this.installation.generateSensorData(this.device, 'Humidity', () => { return rnorm(22, 10); });
    this.installation.generateSensorData(this.device, 'Lux', () => { return rnorm(100, 50); });
    this.installation.generateSensorData(this.device, 'Pressure', () => { return rnorm(25, 5); });
  }

  livingRoom() {
    this.installation.generateSensorData(this.device, 'Temperature', () => { return rnorm(24, 6); });
    this.installation.generateSensorData(this.device, 'Humidity', () => { return rnorm(18, 9); });
    this.installation.generateSensorData(this.device, 'Lux', () => { return rnorm(120, 70); });
    this.installation.generateSensorData(this.device, 'Pressure', () => { return rnorm(26, 7); });
  }

  garageInWinter() {
    this.installation.generateSensorData(this.device, 'Temperature', () => { return rnorm(10, 8); });
    this.installation.generateSensorData(this.device, 'Humidity', () => { return rnorm(30, 11); });
    this.installation.generateSensorData(this.device, 'Lux', () => { return rnorm(30, 50); });
    this.installation.generateSensorData(this.device, 'Pressure', () => { return rnorm(24, 6); });
  }

  outsideInWinter() {
    this.installation.generateSensorData(this.device, 'Temperature', () => { return rnorm(1, 11); });
    this.installation.generateSensorData(this.device, 'Humidity', () => { return rnorm(40, 13); });
    this.installation.generateSensorData(this.device, 'Lux', () => { return rnorm(150, 90); });
    this.installation.generateSensorData(this.device, 'Pressure', () => { return rnorm(20, 7); });
  }

  save() {
    this.model.addDevice(this.device);
  }
}

module.exports = SensortagDeviceFactory;
