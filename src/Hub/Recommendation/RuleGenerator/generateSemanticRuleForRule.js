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

function createConditionOrActionBlank(condition, semanticRule) {
  let conditionBlank = [
      {
        predicate: rdf('type'),
        object: uri('ConditionOrAction')
      },
      {
        predicate: uri('id'),
        object: literal(condition.id)
      },
      {
        predicate: uri('value'),
        object: literal(condition.value)
      },
      {
        predicate: uri('options'),
        object: literal(JSON.stringify(condition.options))
      }
  ];

  if (condition.requiresVirtualSensor()) {
    let virtualSensor = condition.virtualSensors[0];
    let virtualSensorNode = '?vs_' + hashString(virtualSensor.name);

    semanticRule.precondition.push([
      virtualSensorNode, rdf('type'), uri('VirtualSensor')
    ]);
    semanticRule.precondition.push([
      virtualSensorNode, uri('name'), literal(virtualSensor.name)
    ]);

    let locationNode = '?loc_' + hashString(virtualSensor.locationName);
    semanticRule.precondition.push([
      virtualSensorNode, uri('location'), locationNode
    ]);

    conditionBlank.push({
      predicate: uri('virtualSensorName'),
      object: literal(condition.virtualSensorName)
    });
  }

  if (condition.requiresAction()) {
    conditionBlank.push({
      predicate: uri('actionType'),
      object: literal(condition.actionType)
    });
  }

  if (condition.hasLocation()) {
    let locationNode = '?loc_' + hashString(condition.location.name);

    semanticRule.precondition.push([
      locationNode, rdf('type'), uri('Location')
    ]);

    if (condition.requiresAction()) {
      semanticRule.precondition.push([
        locationNode, uri('actionType'), literal(condition.actionType)
      ]);
    }

    conditionBlank.push({
      predicate: uri('location'),
      object: locationNode
    });
  }

  if (condition.requiresDevice()) {
    let deviceNode = '?dev_' + hashString(condition.device.id);

    semanticRule.precondition.push([
      deviceNode, rdf('type'), uri('Device')
    ]);

    if (condition.requiresAction()) {
      semanticRule.precondition.push([
        deviceNode, uri('actionType'), literal(condition.actionType)
      ]);
    }

    conditionBlank.push({
      predicate: uri('device'),
      object: deviceNode
    });
  }

  return conditionBlank;
}

// [
//   location with temperature sensor,
//   virtual sensor name and labels that is built using temperature, pressure, ...
// ]
// [
//   trigger action X on a device
//   trigger action Z on devices in location
// ]
module.exports = (rule) => {
  let writer = N3.Writer();
  let semanticRule = new SemanticRule();

  let ruleBlank = [
      {
        predicate: rdf('type'),
        object: uri('Rule')
      },
      {
        predicate: uri('id'),
        object: literal(rule.id)
      }
  ];

  rule.conditions.forEach((condition) => {
    let conditionBlank = createConditionOrActionBlank(condition, semanticRule);

    ruleBlank.push({
      predicate: uri('condition'),
      object: writer.blank(conditionBlank)
    });
  });

  rule.actions.forEach((action) => {
    let actionBlank = createConditionOrActionBlank(action, semanticRule);

    ruleBlank.push({
      predicate: uri('action'),
      object: writer.blank(actionBlank)
    });
  });

  semanticRule.postcondition.push([
    uri('x'), uri('y'), writer.blank(ruleBlank)
  ]);

  return semanticRule;
};
