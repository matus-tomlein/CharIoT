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

  console.log('Received model with', def.rules.length, 'rules');

  let modelData = Model.blankData;
  modelData.userId = def.id;
  modelData.giotto = def.building;
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
});

app.listen(3131, function () {
  console.log('Listening on port 3131!');
});
