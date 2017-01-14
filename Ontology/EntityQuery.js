var Entity = require('./Entity'),
    validUrl = require('valid-url');

function EntityQuery(type, vocab, store) {
  this.type = type;
  this.vocab = vocab;
  this.store = store;
}

EntityQuery.prototype = (function () {
  return {
    getTypeUri: function () {
      if (validUrl.isUri(this.type)) {
        return this.type;
      }
      return this.vocab.uriFor(this.type);
    },

    all: function () {
      var that = this;
      var types = that.store.find(null, that.vocab.rdf('type'), that.getTypeUri());

      return types.map(function (triple) {
        var entity = new Entity(that.type, that.vocab, that.store);
        entity.setUri(triple.subject);
        entity.load();
        return entity;
      });
    }
  };
})();

module.exports = EntityQuery;
