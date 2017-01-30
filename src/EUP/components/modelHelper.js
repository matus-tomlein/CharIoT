var Model = require('../Model'),
    browserHistory = require('react-router').browserHistory,
    $ = require('jquery');

function fetchData(callback) {
  $.get('/api/data', function (data) {
    if (data.credentials) {
      callback(null, data);
    } else {
      browserHistory.push('/login');
    }
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
