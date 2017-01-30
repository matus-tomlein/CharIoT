const Ontology = require('./Ontology'),
      Reasoner = Ontology.Reasoner,
      vocab = Ontology.vocabulary,
      EntityQuery = Ontology.EntityQuery,
      _ = require('underscore'),

      generateSemanticRuleForRule = require('./generateSemanticRuleForRule'),
      generateSemanticRuleForVirtualSensor = require('./generateSemanticRuleForVirtualSensor'),
      OntologyBuilder = require('./OntologyBuilder'),
      Rule = require('../../../Model/Rule'),
      VirtualSensor = require('../../../Model/VirtualSensor'),
      ConditionOrAction = require('../../../Model/ConditionOrAction');

class RuleGenerator {
  constructor(repository, installation) {
    this.repository = repository;
    this.installation = installation;
  }

  generate(callback) {
    let reasoner = new Reasoner();
    reasoner.addFileSource(__dirname + '/helperRules.n3');

    let installations = this.repository.installations.filter((i) => {
      return i.id != this.installation.id;
    });
    let virtualSensors = _.flatten(installations.map((i) => { return i.virtualSensors; }));

    virtualSensors.forEach((virtualSensor) => {
      let semanticRule = generateSemanticRuleForVirtualSensor(virtualSensor);
      reasoner.addSemanticRule(semanticRule);
    });

    let builder = new OntologyBuilder(this.installation);
    builder.build();
    reasoner.addStore(builder.store);

    let rules = _.flatten(installations.map((i) => { return i.rules; }));
    rules.forEach((rule) => {
      let semanticRule = generateSemanticRuleForRule(rule);
      reasoner.addSemanticRule(semanticRule);
    });

    reasoner.reason((err, store) => {
      if (err) { callback(err); return; }

      let rules = this._findRulesInStore(store);
      rules = this._removeInstalledRules(rules);

      callback(null, rules);
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
        condition.location = this.installation.locations.find((l) => {
          return l.name == locationEntity.literals.name;
        });
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

    if (conditionEntity.references.virtualSensor) {
      let virtualSensorEntities = conditionEntity.references.virtualSensor;
      virtualSensorEntities.forEach((virtualSensorEntity) => {
        virtualSensorEntity.load();
        let name = virtualSensorEntity.literals.name;
        let labels = virtualSensorEntity.literals.label;
        if (!Array.isArray(labels)) labels = [ labels ];
        let locationEntity = virtualSensorEntity.references.location[0];
        locationEntity.load();
        let locationName = locationEntity.literals.name;
        let samples = JSON.parse(virtualSensorEntity.literals.samples);

        let existingVirtualSensor = this.installation.virtualSensors.find((vs) => {
          return vs.name == name && vs.locationName == locationName &&
            JSON.stringify(_.sortBy(vs.labels)) == JSON.stringify(_.sortBy(labels));
        });

        if (existingVirtualSensor) {
          condition.virtualSensor = existingVirtualSensor;
        } else {
          let virtualSensor = new VirtualSensor({}, this.installation);
          virtualSensor.name = name;
          virtualSensor.labels = labels;
          virtualSensor.samples = samples;
          virtualSensor.locationName = locationName;

          let sensors = virtualSensorEntity.literals.sensor;
          if (!Array.isArray(sensors)) sensors = [ sensors ];
          virtualSensor.sensors = sensors;

          condition.recommendedVirtualSensor = virtualSensor;
        }
      });
    }

    return condition;
  }

  _removeInstalledRules(rules) {
    let installedRulesIds = this.installation.rules.map((rule) => {
      return rule.typeId;
    });

    return rules.filter((rule) => {
      return !installedRulesIds.includes(rule.typeId);
    });
  }
}

module.exports = RuleGenerator;
