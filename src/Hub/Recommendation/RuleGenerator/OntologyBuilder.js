var Ontology = require('./Ontology'),
    Entity = Ontology.Entity,
    vocab = Ontology.vocabulary,

    N3 = require('n3');

class OntologyBuilder {
  constructor(installation) {
    this.installation = installation;
    this.store = N3.Store();
  }

  build() {
    this.installation.locations.forEach((location) => {
      var locationEntity = new Entity('Location', vocab, this.store);
      locationEntity.id = location.id;
      locationEntity.literals.name = location.name;
      locationEntity.literals.id = location.id;
      locationEntity.save();

      return locationEntity;
    });

    this.installation.devices.forEach((device) => {
      var deviceEntity = new Entity('Device', vocab, this.store);
      deviceEntity.literals.name = device.name;
      deviceEntity.literals.id = device.id;

      deviceEntity.references.sensor = device.sensors.map((sensor) => {
        var sensorEntity = new Entity('Sensor', vocab, this.store);
        sensorEntity.id = sensor.id;
        sensorEntity.literals.uuid = sensor.uuid;
        sensorEntity.literals.name = sensor.name;
        sensorEntity.references.device = [deviceEntity];
        sensorEntity.save();

        return sensorEntity;
      });

      deviceEntity.references.action = device.actions.map((action) => {
        var actionEntity = new Entity('Action', vocab, this.store);
        actionEntity.id = action.id;
        actionEntity.literals.name = action.name;
        actionEntity.references.device = [deviceEntity];
        actionEntity.save();

        return actionEntity;
      });

      deviceEntity.references.location = device.locations.map((location) => {
        var locationEntity = new Entity('Location', vocab, this.store);
        locationEntity.id = location.id;

        return locationEntity;
      });

      deviceEntity.save();
    });
  }
}

module.exports = OntologyBuilder;
