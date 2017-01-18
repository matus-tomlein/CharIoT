const Device = require('../../src/Model/Device'),
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
    this.installation.generateSensorData(this.device, 'Temperature', () => { return 20; });
    this.installation.generateSensorData(this.device, 'Humidity', () => { return 22; });
    this.installation.generateSensorData(this.device, 'Lux', () => { return 100; });
    this.installation.generateSensorData(this.device, 'Pressure', () => { return 25; });
  }

  livingRoom() {
    this.installation.generateSensorData(this.device, 'Temperature', () => { return 24; });
    this.installation.generateSensorData(this.device, 'Humidity', () => { return 18; });
    this.installation.generateSensorData(this.device, 'Lux', () => { return 120; });
    this.installation.generateSensorData(this.device, 'Pressure', () => { return 26; });
  }

  garageInWinter() {
    this.installation.generateSensorData(this.device, 'Temperature', () => { return 10; });
    this.installation.generateSensorData(this.device, 'Humidity', () => { return 30; });
    this.installation.generateSensorData(this.device, 'Lux', () => { return 30; });
    this.installation.generateSensorData(this.device, 'Pressure', () => { return 24; });
  }

  outsideInWinter() {
    this.installation.generateSensorData(this.device, 'Temperature', () => { return 1; });
    this.installation.generateSensorData(this.device, 'Humidity', () => { return 40; });
    this.installation.generateSensorData(this.device, 'Lux', () => { return 150; });
    this.installation.generateSensorData(this.device, 'Pressure', () => { return 20; });
  }

  save() {
    this.model.addDevice(this.device);
  }
}

module.exports = SensortagDeviceFactory;
