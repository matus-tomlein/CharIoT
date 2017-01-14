var Ontology = require('../../Ontology'),
    Entity = Ontology.Entity,
    vocab = Ontology.vocabulary,

    N3 = require('n3');

class OntologyBuilder {
  constructor(installation) {
    this.installation = installation;
    this.store = N3.Store();
  }

  build() {
    this.installation.devices().forEach((device) => {
      var deviceEntity = new Entity('Device', vocab, this.store);
      deviceEntity.literals.name = device.name;

      deviceEntity.references.sensor = device.sensors().map((sensor) => {
        var sensorEntity = new Entity('Sensor', vocab, this.store);
        sensorEntity.id = sensor.id;
        sensorEntity.name = sensor.name;
        sensorEntity.save();

        return sensorEntity;
      });

      deviceEntity.references.action = device.actions().map((action) => {
        var actionEntity = new Entity('Action', vocab, this.store);
        actionEntity.id = action.id;
        actionEntity.name = action.name;
        actionEntity.save();

        return actionEntity;
      });

      deviceEntity.literals.sensor = device.sensors;
      deviceEntity.literals.action = device.actions;
    });
  }
}

module.exports = OntologyBuilder;
