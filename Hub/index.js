const express = require('express'),
      bodyParser = require('body-parser'),
      _ = require('underscore'),
      Combinatorics = require('js-combinatorics');

function generateId() {
  return Math.random().toString(36).substring(7);
}

var app = express();

app.use(bodyParser.json());

app.post('/', function (req, res) {
  var def = req.body;

  var locations = [];
  var sensors = [];
  var actions = [];

  def.devices.forEach((device) => {
    locations = locations.concat(device.locations.map((l) => {
      return l.name;
    }));
    sensors = sensors.concat(device.sensors.map((s) => {
      return s.name;
    }));
    actions = actions.concat(device.actions.map((a) => {
      return a.name;
    }));
  });

  locations = _.uniq(locations);
  sensors = _.uniq(sensors);
  actions = _.uniq(actions);

  var options = Combinatorics.cartesianProduct(locations, sensors, actions).toArray();
  var rules = options.map((option) => {
    var location = option[0];
    var sensor = option[1];
    var action = option[2];

    return {
      id: generateId(),
      conditions: [
          {
            id: generateId(),
            sensorType: sensor,
            requiredAttributes: [
                {
                  name: 'condition',
                  type: 'numericCondition'
                }
            ],
            attributes: {
              condition: {
                operator: 'LT',
                value: 20
              }
            },
            locationName: location
          }
      ],
      actions: [
          {
            id: generateId(),
            actionType: action,
            attributes: {
              locationScope: 'all'
            },
            requiredAttributes: [
                {
                  name: 'locationScope',
                  type: 'select',
                  options: {
                    all: 'All devices',
                    any: 'Any device'
                  }
                }
            ],
            locationName: location
          }
      ]
    };
  });

  res.json({
    rules: rules
  });
});

app.listen(3131, function () {
  console.log('Listening on port 3131!');
});
