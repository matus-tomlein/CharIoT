const NRP = require('node-redis-pubsub');

class VirtualSensorUpdater {
  constructor(runtime) {
    this.runtime = runtime;
    this.unsubscribes = [];

    let config = { host: 'case.tomlein.org', port: 7777 };
    this.nrp = new NRP(config);
    this.nrp.on('error', (err) => { console.log(err); });
  }

  subscribeToSensor(virtualSensor) {
    let unsubscribe = this.nrp.on(virtualSensor.id, (data) => {
      console.log('Received value', virtualSensor.name, data.value);
      virtualSensor.value = data.value;
      this.runtime.virtualSensorUpdated(virtualSensor.id, data.value);
    });
    this.unsubscribes.push(unsubscribe);
  }

  unsubscribeAll() {
    this.unsubscribes.forEach((unsubscribe) => { unsubscribe(); });
    this.unsubscribes = [];
  }
}

module.exports = VirtualSensorUpdater;
