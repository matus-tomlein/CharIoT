var N3 = require('n3');

function parseN3(input, callback) {
  var store = N3.Store();
  var parser = N3.Parser();

  parser.parse(input,
      function (error, triple) {
        if (triple) {
          store.addTriple(triple);
        } else {
          callback(error, store);
        }
      });
}

module.exports = parseN3;
