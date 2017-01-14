var api = require('../api'),
    N3 = require('n3'),
    express = require('express'),
    SensorTagConnector = require('./SensorTagConnector'),
    ActionListener = require('./ActionListener'),

    LocationOntology = require('./LocationOntology'),

    building = 'My Home';

var store = N3.Store();
var locationOntology = new LocationOntology(building, store);

api.authenticate(function (err) {
  if (err) {
    console.error(err);
  } else {
    var actionListener = new ActionListener();
    actionListener.start(api);

    var connector = new SensorTagConnector(building, api);
    connector.start(function (tag, sensorUuids) {
      console.log('Found tag with ID: ' + tag.id);

      actionListener.addTag(tag);
      locationOntology.addTag(tag, sensorUuids, actionListener.queueName);
    });
  }
});

var app = express();

app.get('/', function (req, res) {
  var writer = N3.Writer({ prefixes: { } });

  store.find(null, null, null).forEach(function (triple) {
    writer.addTriple(triple);
  });

  writer.end(function (error, result) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.send(result);
    }
  });
});

app.listen(3030, function () {
  console.log('Listening on port 3030!');
});
