const Ontology = require('./Ontology'),
      Helpers = require('../../../Helpers'),
      hashString = Helpers.hashString,
      SemanticRule = Ontology.SemanticRule,
      vocab = Ontology.vocabulary,

      N3 = require('n3'),
      N3Util = N3.Util;

function uri(key) { return vocab.case(key); }
function rdf(key) { return vocab.rdf(key); }
function literal(key) { return N3Util.createLiteral(key); }

// [
//   temperature, pressure, ...
// ] => [
//   virtual sensor based on the features
// ]
module.exports = (virtualSensor) => {
  let writer = N3.Writer();
  let semanticRule = new SemanticRule();

  let virtualSensorBlank = [
      {
        predicate: rdf('type'),
        object: uri('VirtualSensor')
      },
      {
        predicate: uri('id'),
        object: literal(virtualSensor.id)
      },
      {
        predicate: uri('name'),
        object: literal(virtualSensor.name)
      },
      {
        predicate: uri('samples'),
        object: literal(JSON.stringify(virtualSensor.samples))
      },
      {
        predicate: uri('labels'),
        object: literal(JSON.stringify(virtualSensor.labels))
      },
      {
        predicate: uri('programmingType'),
        object: literal(virtualSensor.programmingType)
      },
      {
        predicate: uri('conditions'),
        object: literal(JSON.stringify(virtualSensor.data.conditions))
      }
  ];

  virtualSensor.locations.forEach((location) => {
    let locationNode = '?loc_' + hashString(location.name);
    semanticRule.precondition.push([
      locationNode, rdf('type'), uri('Location')
    ]);

    virtualSensorBlank.push({
      predicate: uri('location'),
      object: locationNode
    });
  });

  virtualSensor.sensors.forEach((sensor, i) => {
    let sensorNode = '?sensor_' + i;
    let deviceNode = '?device_' + hashString(sensor.device.id);

    semanticRule.precondition.push([
      sensorNode, rdf('type'), uri('Sensor')
    ]);
    semanticRule.precondition.push([
      sensorNode, uri('name'), literal(sensor.name)
    ]);
    semanticRule.precondition.push([
      sensorNode, uri('device'), deviceNode
    ]);
    sensor.device.locations.forEach((location) => {
      let locationNode = '?loc_' + hashString(location.name);
      semanticRule.precondition.push([
        deviceNode, uri('location'), locationNode
      ]);
    });

    virtualSensorBlank.push({
      predicate: uri('sensor'),
      object: sensorNode
    });
  });

  semanticRule.postcondition.push([
    uri('x'), uri('y'), writer.blank(virtualSensorBlank)
  ]);

  return semanticRule;
};
