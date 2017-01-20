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
      }
  ];

  virtualSensor.labels.forEach((label) => {
    virtualSensorBlank.push({
      predicate: uri('label'),
      object: literal(label)
    });
  });

  let location = virtualSensor.location;
  let locationNode = '?loc_' + hashString(location.name);
  semanticRule.precondition.push([
    locationNode, rdf('type'), uri('Location')
  ]);
  virtualSensorBlank.push({
    predicate: uri('location'),
    object: locationNode
  });

  virtualSensor.sensors.forEach((sensor) => {
    virtualSensorBlank.push({
      predicate: uri('sensor'),
      object: literal(sensor)
    });

    semanticRule.precondition.push([
      locationNode, uri('sensorType'), literal(sensor)
    ]);
  });

  semanticRule.postcondition.push([
    uri('x'), uri('y'), writer.blank(virtualSensorBlank)
  ]);

  return semanticRule;
};
