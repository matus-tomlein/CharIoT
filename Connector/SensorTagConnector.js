var SensorTag = require('sensortag'),
    async = require('async'),
    SensorTagReader = require('./SensorTagReader');

function SensorTagConnector(building, api) {
  this.building = building;
  this.api = api;
}

SensorTagConnector.prototype = (function () {
  function discoveredTag(searcher, tag, callback) {
    var api = searcher.api;
    var building = searcher.building;

    api.searchSensorsInBuilding(building, function (err, response, body) {
      if (err) {
        callback(err); return;
      }

      var sensorUuids = {};
      body.result.forEach(function (sensorInfo) {
        if (sensorInfo.metadata &&
            sensorInfo.metadata.TagId == tag.id &&
            sensorInfo.metadata.Senses) {
          sensorUuids[sensorInfo.metadata.Senses] = sensorInfo.name;
        }
      });

      var sensorTag = new SensorTagReader(tag.id, api);

      if (sensorUuids.Temperature) {
        sensorTag.sensorUuids = sensorUuids;
      } else {
        createSensorsForTag(searcher, tag, function (err, sensorUuids) {
          if (err) {
            callback(err); return;
          }
          sensorTag.sensorUuids = sensorUuids;
        });
      }

      sensorTag.initializeCallbacks(tag);
      callback(null, sensorUuids);
    });
  }

  function createSensorsForTag(searcher, tag, callback) {
    var api = searcher.api;
    var building = searcher.building;

    var sensorTypes = [
      'Temperature',
      'Humidity',
      'Lux',
      'Pressure'
        // 'Accelerometer X',
        // 'Accelerometer Y',
        // 'Accelerometer Z',
        // 'Gyrometer X',
        // 'Gyrometer Y',
        // 'Gyrometer Z',
        // 'Magnetometer X',
        // 'Magnetometer Y',
        // 'Magnetometer Z'
    ];

    createSensorForDevice(api, tag, building, (err, deviceUuid, deviceName) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log(deviceUuid, deviceName, building);

      async.map(sensorTypes, function(type, done) {
        var name = deviceName + '-' + type;
        var identifier = tag.id + '_' + type.replace(/\s+/g, '-').toLowerCase();
        console.log(name, building, identifier);

        api.createSensor(name, building, identifier, function (err, response, body) {
          if (err) {
            done(err);
          } else {
            if (body.uuid) {
              var uuid = body.uuid;

              api.addSensorMetadata(uuid, {
                'Senses': type,
                'DeviceUuid': deviceUuid,
                'TagId': tag.id
              }, function (err) {
                done(err, uuid);
              });
            } else {
              console.log(body);
              done('Failed to create sensor');
            }
          }
        });
      }, function (err, uuids) {
        if (err) {
          callback(err);
        } else {
          var uuidsMap = {};
          sensorTypes.forEach(function (type, i) {
            uuidsMap[type] = uuids[i];
          });

          callback(null, uuidsMap);
        }
      });

    });
  }

  function createSensorForDevice(api, tag, building, callback) {
    var deviceName = 'TI Sensor Tag ' + Math.abs(tag.id.hashCode() % 1000);

    api.createSensor(deviceName, building, tag.id, function (err, response, body) {
      if (err) {
        callback(err);
      } else {
        if (body.uuid) {
          var deviceUuid = body.uuid;

          api.addSensorMetadata(deviceUuid, {
            'DeviceType': 'TI SensorTag',
            'Actions': JSON.stringify([ 'Buzzer', 'Green LED', 'Red LED' ]),
            '&Living room': 'location',
            'TagId': tag.id
          }, function (err) {
            callback(err, deviceUuid, deviceName);
          });
        } else {
          console.log(body);
          callback(body);
        }
      }
    });
  }

  return {
    start: function (callback) {
      var that = this;
      SensorTag.discoverAll(function (tag) {
        tag.connectAndSetUp(function (err) {
          if (err) { console.error(err); return; }

          discoveredTag(that, tag, function (err, sensorUuids) {
            if (err) { console.error(err); return; }

            callback(tag, sensorUuids);
          });
        });
      });
    }
  };
})();

module.exports = SensorTagConnector;
