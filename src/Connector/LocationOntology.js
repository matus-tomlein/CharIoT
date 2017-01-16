var Ontology = require('../Ontology'),
    Entity = Ontology.Entity,
    vocab = Ontology.vocabulary,
    SensorTagOntology = require('./SensorTagOntology'),

    Helpers = require('../Helpers'),
    hashString = Helpers.hashString;

class LocationOntology {
  constructor(buildingName, store) {
    this.buildingName = buildingName;
    this.store = store;
    this.initializeLocation();
    this.initializeNetwork();
  }

  initializeLocation() {
    this.location = new Entity('Location', vocab, this.store);
    this.location.id = 'loc_' + hashString(this.buildingName);
    this.location.literals.name = this.buildingName;
    this.location.references.locationType = [ 'building' ];
    this.location.save();
  }

  initializeNetwork() {
    var gateway = new Entity('Device', vocab, this.store);
    gateway.id = 'gateway_' + hashString(this.buildingName);
    gateway.literals.name = 'Gateway';
    gateway.save();

    var propertyType = new Entity('PropertyType', vocab, this.store);
    propertyType.id = 'bluetoothNetwork';
    propertyType.literals.title = 'Bluetooth network';
    propertyType.literals.kind = 'networking';

    var hostParamType = new Entity('PropertyTypeParameter', vocab, this.store);
    hostParamType.id = 'bluetoothHost';
    hostParamType.literals.name = 'Host';
    hostParamType.literals.accepts = 'Device';
    hostParamType.save();

    this.clientParamType = new Entity('PropertyTypeParameter', vocab, this.store);
    this.clientParamType.id = 'bluetoothClient';
    this.clientParamType.literals.name = 'Client';
    this.clientParamType.literals.accepts = 'Device';
    this.clientParamType.save();

    propertyType.references.parameter = [ hostParamType, this.clientParamType ];
    propertyType.save();

    this.networkingProperty = new Entity('Property', vocab, this.store);
    this.networkingProperty.references.propertyType = [propertyType];

    var hostParam = new Entity('PropertyParameter', vocab, this.store);
    hostParam.id = 'btHost_' + hashString(this.buildingName);
    hostParam.references.parameterType = [ hostParamType ];
    hostParam.references.value = [ gateway ];
    hostParam.save();

    this.networkingProperty.references.parameter = [ hostParam ];
    this.networkingProperty.save();
  }

  addTag(tag, sensorUuids, queueName) {
    var tagOntology = new SensorTagOntology(tag, sensorUuids, queueName);
    var device = tagOntology.build(this.store, this.location);

    var clientParam = new Entity('PropertyParameter', vocab, this.store);
    clientParam.id = 'bt_' + device.id;
    clientParam.references.parameterType = [ this.clientParamType ];
    clientParam.references.value = [ device ];
    clientParam.save();

    this.networkingProperty.references.parameter.push(clientParam);
    this.networkingProperty.save();
  }
}

module.exports = LocationOntology;
