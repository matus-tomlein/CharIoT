var express = require('express'),
    _ = require('underscore'),
    jsx = require('node-jsx'),
    bodyParser = require('body-parser'),
    a = express(),

    giottoApi = require('../api'),
    GIoTTOInitializer = require('./GIoTTOInitializer'),
    HubReporter = require('./HubReporter'),
    Model = require('./Model'),
    Runtime = require('./Runtime'),

    Settings = require('../Helpers').Settings;

a.use(bodyParser.urlencoded());
a.use(bodyParser.json());

var sessionName = 'default';
if (process.argv.length > 2) {
  sessionName = process.argv[2];
}

var blankData = Model.blankData;
blankData.userId = Math.random().toString(36);
var settings = new Settings(__dirname + '/' + sessionName + '.json', blankData);
var runtime;

function refresh(callback) {
  if (runtime) runtime.reset();

  var giottoInitializer = new GIoTTOInitializer(giottoApi, settings);
  giottoInitializer.initialize((err) => {
    if (err) { callback(err); return; }

    if (runtime) runtime.start(new Model(settings.data));

    var hubReporter = new HubReporter(settings);
    hubReporter.report(callback);
  });
}

settings.load(() => {
  settings.save();

  giottoApi.authenticate((err) => {
    if (err) { console.error(err); return; }

    runtime = new Runtime(giottoApi);
    if (err) { console.error(err); return; }

    refresh((err) => {
      if (err) { console.error(err); return; }
    });
  });
});

jsx.install();

a.get('/api/refresh', function (req, res) {
  refresh((err) => {
    if (err) {
      console.log(err);
      res.status(500).end();
    } else {
      res.end('OK');
    }
  });
});

a.get('/api/data', (_, r) => { r.json(settings.data); });
a.get('/api/time', (_, r) => { r.end('' + (new Date().getTime() / 1000)); });

a.post('/api/input/:key', function (req, res) {
  settings.data.input[req.params.key] = req.body;
  settings.save();
  res.end('OK');
});
















// api/virtualSensors

a.post('/api/virtualSensors', function (req, res) {
  settings.data.input.virtualSensors.push(req.body);
  settings.save();
  res.end('OK');
});

a.delete('/api/virtualSensors/:id', function (req, res) {
  settings.data.input.virtualSensors = _.reject(
      settings.data.input.virtualSensors,
      function (virtualSensor) {
        return virtualSensor.id == req.params.id;
      });
  settings.save();
  res.end('OK');
});

a.post('/api/virtualSensors/:id/samples', function (req, res) {
  var virtualSensor = settings.data.input.virtualSensors.find(function (sensor) {
    return sensor.id == req.params.id;
  });
  if (!virtualSensor.samples) virtualSensor.samples = [];
  virtualSensor.samples.push(req.body);
  settings.save();

  res.json(virtualSensor);
});








// api/services

a.get('/api/services/:id/trigger', function (req, res) {
  var model = new Model(settings.data);
  var service = model.services.find(function (service) {
    return service.uriHash == req.params.id;
  });

  if (service) {
    giottoApi.publishToQueue(service.messageQueue,
        JSON.stringify({
          deviceId: service.device.deviceId,
          serviceName: service.serviceName
        }),
        function (err) {
          if (err) res.status(404).end();
          else res.end('OK');
        });
  } else {
    res.status(404).end();
  }
});





// api/configuration

a.post('/api/configuration', function (req, res) {
  settings.data.configuration = req.body;
  settings.save();
  res.end('OK');
});





// api/rules

a.post('/api/rules', function (req, res) {
  settings.data.input.rules = settings.data.input.rules || [];
  settings.data.input.rules.push(req.body);
  settings.save();
  res.end('OK');
});

a.delete('/api/rules/:id', function (req, res) {
  settings.data.input.rules = _.reject(
      settings.data.input.rules,
      (rule) => {
        return rule.id == req.params.id;
      });
  settings.save();
  res.end('OK');
});








function serveIndex(req, res){
  var options = {
    root: __dirname + '/public/',
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };

  res.sendFile('index.html', options, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
  });
}

a.get('/:page', serveIndex);
a.get('/refresh/:page', serveIndex);
a.get('/build/:page', serveIndex);
a.get('/train/:page', serveIndex);

a.use(express.static('public'));
a.listen(3333, function () {
  console.log('Example app listening on port 3333!');
});
