var Ontology = require('../Ontology'),
    Entity = Ontology.Entity,
    vocab = Ontology.vocabulary,

    Helpers = require('../Helpers'),
    hashString = Helpers.hashString;

function SensorTagOntology(tag, sensorUuids, actionQueue) {
  this.tag = tag;
  this.sensorUuids = sensorUuids;
  this.actionQueue = actionQueue;
}

SensorTagOntology.prototype = (function () {
  function buildDevice(tag, store) {
    var device = new Entity('Device', vocab, store);
    device.id = 'dev_' + tag.id;
    device.literals.deviceId = tag.id;
    device.literals.name = 'TI Sensor Tag ' + Math.abs(tag.id.hashCode() % 1000);

    var characteristic = new Entity('DeviceCharacteristic', vocab, store);
    characteristic.references.characteristicType = [ 'sensorTag' ];
    characteristic.literals.value = 'Bluetooth';
    characteristic.save();

    device.references.characteristic = [ characteristic ];
    device.save();

    return device;
  }

  function placeInLocation(device, location, store) {
    var of = new Entity('ArrangementNode', vocab, store);
    of.references.device = [ device ];
    of.save();
    var placement = new Entity('Placement', vocab, store);
    placement.references.in = [ location ];
    placement.references.of = [ of ];
    placement.save();
  }

  function createServices(device, ontology, store) {
    var sensorUuids = ontology.sensorUuids;
    device.references.service = [];

    for (var sensorType in sensorUuids) {
      var characteristic = new Entity('ServiceCharacteristic', vocab, store);
      characteristic.references.characteristicType = [ 'sensorService' ];
      characteristic.literals.value = sensorType;
      characteristic.save();

      var service = new Entity('Service', vocab, store);
      service.id = hashString([device.id, sensorUuids[sensorType]].join(' '));
      service.literals.macId = sensorUuids[sensorType];
      service.literals.serviceType = 'provider';
      service.literals.dataType = 'numeric';
      service.literals.name = sensorType;
      service.references.device = [ device ];
      service.references.characteristic = [ characteristic ];
      service.save();

      device.references.service.push(service);
    }

    var consumerServices = [
        {
          name: 'Buzzer',
          serviceName: 'buzzer',
          characteristics: [
              {
                characteristicType: 'buzzer'
              }
          ]
        },
        {
          name: 'Green LED',
          serviceName: 'greenLED',
          characteristics: [
              {
                characteristicType: 'led',
                value: 'Green'
              }
          ]
        },
        {
          dataType: 'boolean',
          name: 'Red LED',
          serviceName: 'redLED',
          characteristics: [
              {
                characteristicType: 'led',
                value: 'Red'
              }
          ]
        }
    ];

    consumerServices.forEach(function (def, i) {
      var characteristics = def.characteristics.map(function (ch) {
        var characteristic = new Entity('ServiceCharacteristic', vocab, store);
        characteristic.references.characteristicType = [ ch.characteristicType ];
        if (ch.value) characteristic.literals.value = ch.value;
        characteristic.save();
        return characteristic;
      });

      var service = new Entity('Service', vocab, store);
      service.id = hashString([device.id, def.name, i].join(' '));
      service.literals.serviceType = 'consumer';
      service.literals.messageQueue = ontology.actionQueue;
      service.literals.serviceName = def.serviceName;
      service.literals.name = def.name;
      service.references.device = [ device ];
      service.references.characteristic = characteristics;
      service.save();

      device.references.service.push(service);
    });

    device.save();
  }

  return {
    build: function (store, location) {
      var device = buildDevice(this.tag, store);
      placeInLocation(device, location, store);
      createServices(device, this, store);
      return device;
    }
  };
})();

module.exports = SensorTagOntology;
