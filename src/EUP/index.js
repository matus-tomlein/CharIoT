var express = require('express'),
    _ = require('underscore'),
    jsx = require('node-jsx'),
    bodyParser = require('body-parser'),
    Rule = require('../Model/Rule'),

    Main = require('./Main');

let main = new Main();

main.initialize((err) => {
  if (err) { console.error(err); return; }

  let a = express();
  a.use(bodyParser.urlencoded());
  a.use(bodyParser.json());

  jsx.install();

  a.get('/api/refresh', function (req, res) {
    main.refresh((err) => {
      if (err) {
        console.log(err);
        res.status(500).end();
      } else {
        res.end('OK');
      }
    });
  });

  a.get('/api/data', (_, r) => { r.json(main.settings.data); });
  a.get('/api/time', (_, r) => { r.end('' + (new Date().getTime() / 1000)); });

  a.post('/api/input/:key', function (req, res) {
    main.settings.data.input[req.params.key] = req.body;
    main.settings.save();
    res.end('OK');
  });
















  // api/virtualSensors

  a.post('/api/virtualSensors', function (req, res) {
    main.settings.data.input.virtualSensors.push(req.body);
    main.settings.save();
    res.end('OK');
  });

  a.get('/api/virtualSensors/:id/train', function (req, res) {
    let model = main.model;
    let virtualSensor = model.virtualSensors.find(function (sensor) {
      return sensor.id == req.params.id;
    });

    virtualSensor.trainSamples(main.giottoApi, (err) => {
      if (err) {
        res.status(500).end();
      } else {
        main.settings.save();
        res.end('OK');
      }
    });
  });

  a.delete('/api/virtualSensors/:id', function (req, res) {
    main.settings.data.input.virtualSensors = _.reject(
        main.settings.data.input.virtualSensors,
        function (virtualSensor) {
          return virtualSensor.id == req.params.id;
        });
    main.settings.save();
    res.end('OK');
  });

  a.post('/api/virtualSensors/:id/samples', function (req, res) {
    let model = main.model;
    let virtualSensor = model.virtualSensors.find(function (sensor) {
      return sensor.id == req.params.id;
    });

    virtualSensor.addSample(req.body);
    main.settings.save();
    res.json(virtualSensor.toData());
  });








  // api/services

  a.get('/api/services/:id/trigger', function (req, res) {
    var model = main.model;
    var service = model.services.find(function (service) {
      return service.uriHash == req.params.id;
    });

    if (service) {
      main.giottoApi.publishToQueue(service.messageQueue,
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
    main.settings.data.configuration = req.body;
    main.settings.save();
    res.end('OK');
  });





  // api/rules

  a.post('/api/rules', function (req, res) {
    let model = main.model;
    let rule = new Rule(req.body, model);

    rule.conditions.forEach((condition) => {
      if (condition.requiresRecommendedVirtualSensor()) {
        let recommendedSensor = condition.recommendedVirtualSensor;

        model.addVirtualSensor(recommendedSensor);
        condition.virtualSensor = recommendedSensor;
      }
    });
    model.addRule(rule);

    main.settings.save();
    res.end('OK');
  });

  a.delete('/api/rules/:id', function (req, res) {
    let settings = main.settings;
    settings.data.input.rules = _.reject(
        settings.data.input.rules,
        (rule) => {
          return rule.id == req.params.id;
        });
    settings.save();
    res.end('OK');
  });









  a.get('/:page', serveIndex);
  a.get('/refresh/:page', serveIndex);
  a.get('/build/:page', serveIndex);
  a.get('/train/:page', serveIndex);

  a.use(express.static('public'));

  let port = 3333;
  if (main.settings.data.port) {
    port = main.settings.data.port;
  }
  a.listen(port, function () {
    console.log('Listening on port ' + port + '!');
  });
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
