var N3 = require('n3');

function serializeN3(store, callback) {
  var writer = N3.Writer({ prefixes: {} });
  store.find(null, null, null).forEach(function (triple) {
    writer.addTriple(triple);
  });
  writer.end(callback);
}

module.exports = serializeN3;
