class VirtualSensorUpdater {
  constructor(api) {
    this.api = api;
    this.subscriptions = [];
  }

  subscribeToSensor(virtualSensor) {
    let subscription = this.api.subscribeToSensor(virtualSensor.id, (value) => {
      console.log('Received value', virtualSensor.name, value);
      value = virtualSensor.labels[value];
      virtualSensor.value = value;
      this.runtime.virtualSensorUpdated(virtualSensor.id, value);
    });
    this.subscriptions.push(subscription);
  }

  unsubscribeAll() {
    this.subscriptions.forEach((subscription) => { subscription.stop(); });
    this.subscriptions = [];
  }
}

module.exports = VirtualSensorUpdater;
