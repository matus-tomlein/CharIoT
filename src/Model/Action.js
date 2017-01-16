const generateId = require('./generateId');

class Action {
  constructor(data, device) {
    this.id = data.id || generateId();
    this.name = data.name;
    this.device = device;
  }

  toData() {
    return {
      id: this.id,
      name: this.name
    };
  }
}

module.exports = Action;
