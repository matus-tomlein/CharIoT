function getTime() {
  return new Date().getTime() / 1000;
}

class RuleAction {
  constructor(action, api) {
    this.action = action;
    this.api = api;
    this.messageQueue = 'iot-commissioner-actions';
  }

  trigger() {
    var actionName = this.action.actionType;

    var devices = this.action.devicesWithAction();

    devices.forEach((device) => {
      let action = device.actionFor(actionName);
      if (action && action.uuid) {
        console.log('Executing action', this.messageQueue, actionName, device.id);

        let parameter = 1;
        if (this.action.value) {
          parameter = this.action.value;
        }
        this.api.postTimeseriesValue(action.uuid, getTime(), parameter);
      }
    });
  }
}

module.exports = RuleAction;
