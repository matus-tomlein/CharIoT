const express = require('express'),
      bodyParser = require('body-parser'),

      Repository = require('./Repository'),
      RecommendationService = require('./RecommendationService'),
      Model = require('../Model'),
      DataModel = require('../DataModel');

let repository = new Repository();
let app = express();

app.use(bodyParser.json());

app.post('/', function (req, res) {
  var def = req.body;

  let modelData = Model.blankData;
  modelData.userId = def.id;
  modelData.giotto.devices = def.devices;
  modelData.input.rules = def.rules;
  modelData.input.virtualSensors = def.virtualSensors;

  let model = new Model(modelData);
  let dataModel = DataModel.fromData(def.dataModel, model);

  repository.addInstallation(model);
  repository.addInstallationDataModel(dataModel);

  let recommendationService = new RecommendationService(model, repository);
  recommendationService.recommendRules((err, recommendations) => {
    if (err) {
      console.error(err);
      res.status(500).end();
    } else {
      res.json(recommendations.toData());
    }
  });

  // var locations = [];
  // var sensors = [];
  // var actions = [];
  //
  // def.devices.forEach((device) => {
  //   locations = locations.concat(device.locations.map((l) => {
  //     return l.name;
  //   }));
  //   sensors = sensors.concat(device.sensors.map((s) => {
  //     return s.name;
  //   }));
  //   actions = actions.concat(device.actions.map((a) => {
  //     return a.name;
  //   }));
  // });
  //
  // locations = _.uniq(locations);
  // sensors = _.uniq(sensors);
  // actions = _.uniq(actions);
  //
  // var options = Combinatorics.cartesianProduct(locations, sensors, actions).toArray();
  // var rules = options.map((option) => {
  //   var location = option[0];
  //   var sensor = option[1];
  //   var action = option[2];
  //
  //   return {
  //     id: generateId(),
  //     conditions: [
  //         {
  //           id: generateId(),
  //           sensorType: sensor,
  //           requiredAttributes: [
  //               {
  //                 name: 'condition',
  //                 type: 'numericCondition'
  //               }
  //           ],
  //           attributes: {
  //             condition: {
  //               operator: 'LT',
  //               value: 20
  //             }
  //           },
  //           locationName: location
  //         }
  //     ],
  //     actions: [
  //         {
  //           id: generateId(),
  //           actionType: action,
  //           attributes: {
  //             locationScope: 'all'
  //           },
  //           requiredAttributes: [
  //               {
  //                 name: 'locationScope',
  //                 type: 'select',
  //                 options: {
  //                   all: 'All devices',
  //                   any: 'Any device'
  //                 }
  //               }
  //           ],
  //           locationName: location
  //         }
  //     ]
  //   };
  // });
  //
  // res.json({
  //   rules: rules
  // });
});

app.listen(3131, function () {
  console.log('Listening on port 3131!');
});
