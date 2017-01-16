var N3 = require('n3'),
    N3Util = N3.Util;

function readList(firstUri, vocab, store) {
  var list = [];
  var uri = firstUri;
  var Entity = require('./Entity');

  while (uri) {
    var items = store.find(uri, vocab.rdf('first'), null);
    if (items.length) {
      var item = items[0];
      if (N3Util.isLiteral(item.object)) {
        list.push(N3Util.getLiteralValue(item.object));
      } else {
        var types = store.find(item.object, vocab.rdf('type'), null);
        if (types.length) {
          var entity = new Entity(types[0].object, vocab, store);
          entity.setUri(item.object);
          list.push(entity);
        } else {
          list.push(item.object);
        }
      }
    }

    items = store.find(uri, vocab.rdf('rest'), null);
    if (items.length) {
      uri = items[0].object;
    } else {
      uri = null;
    }
  }

  return list;
}

module.exports = readList;
