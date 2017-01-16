function ActionListener() {
  this.tags = {};
  this.queueName = 'iot-commissioner-actions';
}

ActionListener.prototype = (function () {
  function triggerIo(tag, io) {
    tag.writeIoData(io, function () {
      setTimeout(function () {
        tag.writeIoData(0, function () {});
      }, 1000);
    });
  }

  function executeService(tag, serviceName, value) {
    if (value == 'false') {
      tag.writeIoData(0, function () {});
    } else {
      switch (serviceName) {
      case 'Buzzer':
        if (value == 'true')
          tag.writeIoData(4, function () {});
        else
          triggerIo(tag, 4);
        break;

      case 'Green LED':
        if (value == 'true')
          tag.writeIoData(2, function () {});
        else
          triggerIo(tag, 2);
        break;

      case 'Red LED':
        if (value == 'true')
          tag.writeIoData(1, function () {});
        else
          triggerIo(tag, 1);
        break;
      }
    }
  }

  return {

    addTag: function (tag) {
      var that = this;

      tag.writeIoData(0, function () {
        tag.writeIoConfig(1, function () {
          that.tags[tag.id] = tag;
        });
      });
    },

    start: function (api) {
      var that = this;

      api.subscribeToQueue(this.queueName, function (err, msg) {
        if (err) { console.error(err); return; }

        console.log('Received message', msg.content.toString());
        var message = JSON.parse(msg.content.toString());

        if (that.tags[message.deviceId]) {
          executeService(that.tags[message.deviceId],
              message.actionName,
              message.value);
        } else {
          console.error('Tag with ID', message.deviceId, 'not known');
        }
      });
    }
  };
})();

module.exports = ActionListener;
