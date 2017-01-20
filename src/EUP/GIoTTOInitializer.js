const hashString = require('../Helpers').hashString;

class GIoTTOInitializer {
  constructor(api, settings) {
    this.api = api;
    this.settings = settings;
  }

  initialize(callback) {
    var building = 'My Home';
    var devices = {};

    this.api.searchSensorsInBuilding(building, (err, response, body) => {
      if (err) {
        callback(err);
        return;
      }

      body.result.forEach((sensor) => {
        if (sensor.metadata.DeviceUuid) {
          var deviceUuid = sensor.metadata.DeviceUuid;
          devices[deviceUuid] = devices[deviceUuid] || {
            sensors: []
          };

          devices[deviceUuid].sensors.push({
            name: sensor.metadata.Senses,
            min: sensor.metadata.MinValue || 0,
            max: sensor.metadata.MaxValue || 100,
            id: sensor.name
          });
        }
        else {
          devices[sensor.name] = devices[sensor.name] || {};
          devices[sensor.name].sensors = devices[sensor.name].sensors || [];
          devices[sensor.name].name = sensor.source_name;
          devices[sensor.name].id = sensor.name;
          devices[sensor.name].tagId = sensor.metadata.TagId;

          var actions = JSON.parse(sensor.metadata.Actions || '[]');
          devices[sensor.name].actions = actions.map((action) => {
            return {
              id: hashString(sensor.name + action),
              name: action
            };
          });
          devices[sensor.name].locations = [];

          for (var key in sensor.metadata) {
            if (sensor.metadata[key] == 'location') {
              var location = key.substr(1);

              devices[sensor.name].locations.push({
                name: location
              });
            }
          }
        }
      });

      devices = Object.keys(devices).map(function(key) { return devices[key]; });

      this.settings.data.giotto = this.settings.data.giotto || {};
      this.settings.data.giotto.devices = devices;
      this.settings.save();

      callback();
    });
  }
}

module.exports = GIoTTOInitializer;
