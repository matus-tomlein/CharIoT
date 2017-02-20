var express = require('express'),
    _ = require('underscore'),
    jsx = require('node-jsx'),
    bodyParser = require('body-parser'),

    model = require('../chariotModel'),
    Device = model.Device,
    Rule = model.Rule,
    VirtualSensor = model.VirtualSensor,

    Main = require('./Main');

let main = new Main();

main.initialize((err) => {
  if (err) { console.error(err); return; }

  let a = express();
  a.use(bodyParser.urlencoded());
  a.use(bodyParser.json());

  jsx.install();





  // api/login

  a.post('/api/login', (req, res) => {
    main.login(req.body, (err) => {
      if (err) {
        console.log(err);
        res.status(500).end();
      } else {
        res.end('OK');
      }
    });
  });




  // api/refresh

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

  a.get('/api/data', (_, r) => {
    r.json(main.settings.data);
  });

  a.get('/api/time', (_, r) => { r.end('' + (new Date().getTime() / 1000)); });

  a.post('/api/input/:key', function (req, res) {
    main.settings.data.input[req.params.key] = req.body;
    main.settings.save();
    res.end('OK');
  });
















  // api/virtualSensors

  a.post('/api/virtualSensors', function (req, res) {
    let model = main.model;
    let vs = new VirtualSensor(req.body, model.building);
    main.giottoApi.createVirtualSensor(vs, (err) => {
      if (err) {
        console.log(err);
        res.status(500).end();
        return;
      }

      res.end('OK');
    });
  });




  // /api/devices

  a.post('/api/devices/:id', function (req, res) {
    let model = main.model;
    let device = new Device(req.body, model.building);

    main.giottoApi.updateDevice(device, (err) => {
      if (err) {
        console.log(err);
        res.status(500).end();
        return;
      }

      res.end('OK');
    });
  });







  // api/actions

  a.get('/api/actions/:id/trigger', function (req, res) {
    let model = main.model;
    let action = model.actions.find((action) => {
      return action.id == req.params.id;
    });

    if (action && action.uuid) {
      console.log('Executing action', this.messageQueue, action.name);

      let parameter = 2;
      let time = new Date().getTime() / 1000;
      main.giottoApi.postTimeseriesValue(action.uuid, time, parameter);
    }

    res.end('OK');
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
    let rule = new Rule(req.body, model.building);
    main.giottoApi.createRule(rule, (err) => {
      if (err) {
        console.log(err);
        res.status(500).end();
        return;
      }

      res.end('OK');
    });

    // rule.conditions.forEach((condition) => {
    //   if (condition.requiresRecommendedVirtualSensor()) {
    //     let recommendedSensor = condition.recommendedVirtualSensor;
    //
    //     model.addVirtualSensor(recommendedSensor);
    //     condition.virtualSensor = recommendedSensor;
    //   }
    // });
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
