const Ontology = require('./Ontology'),
      Reasoner = Ontology.Reasoner,
      vocab = Ontology.vocabulary,
      EntityQuery = Ontology.EntityQuery,
      _ = require('underscore'),

      generateSemanticRuleForRule = require('./generateSemanticRuleForRule'),
      generateSemanticRuleForVirtualSensor = require('./generateSemanticRuleForVirtualSensor'),
      OntologyBuilder = require('./OntologyBuilder'),
      chariotModel = require('../../../chariotModel'),
      Rule = chariotModel.Rule,
      VirtualSensor = chariotModel.VirtualSensor,
      ConditionOrAction = chariotModel.ConditionOrAction;

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

      let virtualSensors = this._findVirtualSensorsInStore(store);

      callback(null, rules, virtualSensors);
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

  _findVirtualSensorsInStore(store) {
    let query = new EntityQuery('VirtualSensor', vocab, store);
    let virtualSensors = [];

    query.all().forEach((entity) => {
      let name = entity.literals.name;
      let programmingType = entity.literals.programmingType;
      let labels = JSON.parse(entity.literals.labels);
      let samples = JSON.parse(entity.literals.samples);
      let conditions = JSON.parse(entity.literals.conditions);

      let sensors = entity.references.sensor;
      let inputs = sensors.map((sensorEntity) => {
        sensorEntity.load();
        return sensorEntity.literals.uuid;
      });

      let virtualSensor = new VirtualSensor({}, this.installation);
      virtualSensor.name = name;
      virtualSensor.labels = labels;
      virtualSensor.samples = samples;
      virtualSensor.data.conditions = conditions;
      virtualSensor.programmingType = programmingType;
      virtualSensor.inputs = inputs;

      let existingVirtualSensor = this.installation.virtualSensors.find((vs) => {
        console.log(vs.typeId);
        console.log(virtualSensor.typeId);
        return vs.typeId == virtualSensor.typeId;
      });

      if (!existingVirtualSensor) {
        let newVirtualSensor = virtualSensors.find((vs) => {
          return vs.typeId == virtualSensor.typeId;
        });

        if (!newVirtualSensor) {
          virtualSensors.push(virtualSensor);
        }
      }
    });

    return virtualSensors;
  }

  _createConditionOrAction(conditionEntity) {
    let condition = new ConditionOrAction({}, this.installation);
    condition.options = JSON.parse(conditionEntity.literals.options);
    condition.value = conditionEntity.literals.value;

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

    if (conditionEntity.literals.virtualSensorName) {
      condition.virtualSensorName = conditionEntity.literals.virtualSensorName;
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
