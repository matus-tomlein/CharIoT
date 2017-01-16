function SensorTagReader(id, api) {
  this.id = id;
  this.api = api;
}

var samplingPeriod = 2000;

SensorTagReader.prototype = (function () {

  // function setUpTemperatureListeners(device, tag) {
  //   tag.enableIrTemperature(function (err) {
  //     if (err) { console.error(err); return; }
  //
  //     tag.notifyIrTemperature(function (err) {
  //       if (err) { console.error(err); return; }
  //
  //       tag.setIrTemperaturePeriod(1000, function (err) {
  //         if (err) { console.error(err); return; }
  //
  //         tag.on('irTemperatureChange', function (objectTemperature, ambientTemperature) {
  //           console.log('IR', objectTemperature, ambientTemperature);
  //         });
  //       });
  //     });
  //   });
  // }

  function getTime() {
    return new Date().getTime() / 1000;
  }

  function logError(err, response, body) {
    if (err) {
      console.error(err);
    }
    else if (response.statusCode != 200) {
      console.error(body);
    }
    else {
      console.log('OK');
    }
  }

  function setUpHumidityListeners(device, tag) {
    tag.enableHumidity(function (err) {
      if (err) { console.error(err); return; }

      tag.notifyHumidity(function (err) {
        if (err) { console.error(err); return; }

        tag.setHumidityPeriod(samplingPeriod, function (err) {
          if (err) { console.error(err); return; }

          tag.on('humidityChange', function (temperature, humidity) {
            device.updateTemperatureAndHumidity(temperature, humidity);
          });
        });
      });
    });
  }

  function setUpPressureListeners(device, tag) {
    tag.enableBarometricPressure(function (err) {
      if (err) { console.error(err); return; }

      tag.notifyBarometricPressure(function (err) {
        if (err) { console.error(err); return; }

        tag.setBarometricPressurePeriod(samplingPeriod, function (err) {
          if (err) { console.error(err); return; }

          tag.on('humidityChange', function (pressure) {
            device.updatePressure(pressure);
          });
        });
      });
    });
  }

  function setUpLuxometerListeners(device, tag) {
    tag.enableLuxometer(function (err) {
      if (err) { console.error(err); return; }

      tag.notifyLuxometer(function (err) {
        if (err) { console.error(err); return; }

        tag.setLuxometerPeriod(samplingPeriod, function (err) {
          if (err) { console.error(err); return; }

          tag.on('luxometerChange', function (lux) {
            device.updateLuxometer(lux);
          });
        });
      });
    });
  }

  return {
    initializeCallbacks: function (tag) {
      var that = this;

      tag.on('disconnect', function() {
        tag.unnotifyHumidity();
        tag.unnotifyBarometricPressure();
        tag.unnotifyLuxometer();
      });

      setUpHumidityListeners(that, tag);
      setUpPressureListeners(that, tag);
      setUpLuxometerListeners(that, tag);
    },

    updateTemperatureAndHumidity: function (temperature, humidity) {
      var time = getTime();
      this.api.postTimeseriesValue(this.sensorUuids.Temperature, time, temperature);
      this.api.postTimeseriesValue(this.sensorUuids.Humidity, time, humidity);
    },

    updatePressure: function (pressure) {
      var time = getTime();
      this.api.postTimeseriesValue(this.sensorUuids.Pressure, time, pressure);
    },

    updateLuxometer: function (lux) {
      var time = getTime();
      this.api.postTimeseriesValue(this.sensorUuids.Lux, time, lux);
    }
  };
})();

module.exports = SensorTagReader;
