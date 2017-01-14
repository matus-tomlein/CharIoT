var Model = require('../Model'),
    $ = require('jquery');

function fetchData(callback) {
  $.get('/api/data', function (data) {
    callback(null, data);
  });
}

function createFromData(data, filter = {}) {
  return new Model(data, filter);
}

module.exports = {
  fetch: fetchData,
  blankData: Model.blankData,
  create: createFromData
};
