const Ontology = require('./Ontology'),
      Reasoner = Ontology.Reasoner,
      vocab = Ontology.vocabulary,
      EntityQuery = Ontology.EntityQuery,

      generateSemanticRuleForRule = require('./generateSemanticRuleForRule'),
      OntologyBuilder = require('./OntologyBuilder'),
      Rule = require('../../../Model/Rule'),
      Location = require('../../../Model/Location'),
      ConditionOrAction = require('../../../Model/ConditionOrAction');

class RuleGenerator {
  constructor(repository, installation) {
    this.repository = repository;
    this.installation = installation;
  }

  generate(callback) {
    let reasoner = new Reasoner();

    // this.repository.virtualSensors.forEach((virtualSensor) => {
    //
    // });

    reasoner.addFileSource(__dirname + '/helperRules.n3');

    let builder = new OntologyBuilder(this.installation);
    builder.build();
    reasoner.addStore(builder.store);

    this.repository.rules.forEach((rule) => {
      let semanticRule = generateSemanticRuleForRule(rule);
      reasoner.addSemanticRule(semanticRule);
    });

    reasoner.reason((err, store) => {
      if (err) { callback(err); return; }

      callback(null, this._findRulesInStore(store));
    });
  }

  _findRulesInStore(store) {
    let query = new EntityQuery('Rule', vocab, store);
    return query.all().map((entity) => {
      let rule = new Rule({}, this.installation);

      entity.references.condition.forEach((conditionEntity) => {
        conditionEntity.load();
        let condition = this._createConditionOrAction(conditionEntity);
        rule.addCondition(condition);
      });

      entity.references.action.forEach((actionEntity) => {
        actionEntity.load();
        let action = this._createConditionOrAction(actionEntity);
        rule.addAction(action);
      });

      return rule;
    });
  }

  _createConditionOrAction(conditionEntity) {
    let condition = new ConditionOrAction({}, this.installation);
    condition.attributes = JSON.parse(conditionEntity.literals.attributesJson);
    condition.requiredAttributes = JSON.parse(conditionEntity.literals.requiredAttributesJson);

    if (conditionEntity.literals.sensorType) {
      condition.sensorType = conditionEntity.literals.sensorType;
    }

    if (conditionEntity.literals.actionType) {
      condition.actionType = conditionEntity.literals.actionType;
    }

    if (conditionEntity.references.location) {
      let locationEntities = conditionEntity.references.location;
      locationEntities.forEach((locationEntity) => {
        locationEntity.load();
        condition.location = new Location(locationEntity.literals.name,
              this.installation);
      });
    }

    if (conditionEntity.references.device) {
      let deviceEntities = conditionEntity.references.device;
      deviceEntities.forEach((deviceEntity) => {
        deviceEntity.load();
        let device = this.installation.devices.find((device) => {
          return device.id == deviceEntity.literals.id;
        });
        condition.device = device;
      });
    }

    return condition;
  }
}

module.exports = RuleGenerator;
