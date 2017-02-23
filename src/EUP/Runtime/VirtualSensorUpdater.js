const NRP = require('node-redis-pubsub');

class VirtualSensorUpdater {
  constructor(runtime) {
    this.runtime = runtime;
    this.unsubscribes = [];

    let config = { port: 6379 };
    this.nrp = new NRP(config);
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
