class RuleAction {
  constructor(action, api) {
    this.action = action;
    this.api = api;
    this.messageQueue = 'iot-commissioner-actions';
  }

  trigger() {
    var actionName = this.action.actionType;

    var devices = this.action.devicesWithAction();
    if (this.action.attributes.locationScope == 'any' &&
        devices.length) {
      devices = [ devices[0] ];
    }

    devices.forEach((device) => {
      console.log('Executing action', this.messageQueue,
          actionName,
          device.id);
      this.api.publishToQueue(this.messageQueue,
          JSON.stringify({
            deviceId: device.id,
            actionName: actionName
          }),
          (err) => {
            if (err) console.error(err);
          });
    });
  }
}

module.exports = RuleAction;
