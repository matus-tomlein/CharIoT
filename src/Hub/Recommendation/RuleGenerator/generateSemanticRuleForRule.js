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
        predicate: uri('attributesJson'),
        object: literal(JSON.stringify(condition.attributes))
      },
      {
        predicate: uri('requiredAttributesJson'),
        object: literal(JSON.stringify(condition.requiredAttributes))
      }
  ];

  if (condition.requiresSensor()) {
    conditionBlank.push({
      predicate: uri('sensorType'),
      object: literal(condition.sensorType)
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

    if (condition.requiresSensor()) {
      semanticRule.precondition.push([
        locationNode, uri('sensorType'), literal(condition.sensorType)
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

    if (condition.requiresSensor()) {
      semanticRule.precondition.push([
        deviceNode, uri('sensorType'), literal(condition.sensorType)
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
//   temperature, pressure, ...
// ] => [
//   virtual sensor based on the features
// ]
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
