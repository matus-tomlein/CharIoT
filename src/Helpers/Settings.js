var fs = require('fs');

function Settings(filePath, template) {
  this.filePath = filePath;
  this.data = template || {};
}

Settings.prototype = (function () {
  return {
    save: function (callback) {
      fs.writeFile(this.filePath,
          JSON.stringify(this.data),
          function (err) {
            if (err) console.log(err);
            if (callback) callback(err);
          });
    },

    load: function (callback) {
      var that = this;
      fs.readFile(this.filePath, 'utf8', function (err,data) {
        if (err) {
          console.log(err);
        } else {
          that.data = JSON.parse(data);
        }
        if (callback) callback(err);
      });
    }
  };
})();

module.exports = Settings;
