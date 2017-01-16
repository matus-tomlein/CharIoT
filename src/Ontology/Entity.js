var N3 = require('n3'),
    _ = require('underscore'),
    validUrl = require('valid-url'),
    readList = require('./readList'),
    N3Util = N3.Util;

function Entity(type, vocab, store) {
  this.store = store;
  this.type = type;
  this.vocab = vocab;
  this.id = Math.random().toString(36).substring(7);
  this.uri = null;
  this.literals = {};
  this.references = {};
}

Entity.prototype = (function () {
  return {
    setUri: function (uri) {
      if (uri.startsWith(this.vocab.prefix)) {
        this.id = uri.substring(this.vocab.prefix.length);
      } else {
        this.uri = uri;
      }
    },

    getUri: function () {
      if (this.uri) return this.uri;
      return this.vocab.uriFor(this.id);
    },

    getTypeUri: function () {
      if (validUrl.isUri(this.type)) {
        return this.type;
      }
      return this.vocab.uriFor(this.type);
    },

    addReference: function (predicate, entity) {
      if (this.references[predicate]) {
        var referencedUris = this.references[predicate].map(function (e) {
          if (e.getUri) return e.getUri();
          return e;
        });

        var uri = entity;
        if (entity.getUri) uri = entity.getUri();

        if (!_.contains(referencedUris, uri))
          this.references[predicate].push(entity);
      } else {
        this.references[predicate] = [ entity ];
      }
    },

    getList: function (predicate) {
      var uris = this.references[predicate];
      if (!uris || !uris.length) return [];

      return readList(uris[0], this.vocab, this.store);
    },

    load: function () {
      var that = this;
      var items = this.store.find(this.getUri(), null, null);
      items.forEach(function (item) {
        if (!item.object) return;

        if (item.predicate.startsWith(that.vocab.prefix)) {
          var predicate = item.predicate.substring(that.vocab.prefix.length);

          if (N3Util.isLiteral(item.object)) {
            if (that.literals[predicate]) {
              if (Array.isArray(that.literals[predicate])) {
                that.literals[predicate].push(N3Util.getLiteralValue(item.object));
              } else {
                that.literals[predicate] = [
                  that.literals[predicate],
                  N3Util.getLiteralValue(item.object)
                ];
              }
            } else {
              that.literals[predicate] = N3Util.getLiteralValue(item.object);
            }
          } else {
            var types = that.store.find(item.object, that.vocab.rdf('type'), null);
            if (types.length) {
              var entity = new Entity(types[0].object, that.vocab, that.store);
              entity.setUri(item.object);
              that.addReference(predicate, entity);
            } else {
              that.addReference(predicate, item.object);
            }
          }
        }
      });
    },

    save: function () {
      var that = this;
      var vocab = this.vocab;
      var uri = this.getUri();

      var items = this.store.find(uri, null, null);
      this.store.removeTriples(items);

      this.store.addTriple(uri, vocab.rdf('type'), this.getTypeUri());

      for (var key in this.literals) {
        var value = this.literals[key];
        if (Array.isArray(value)) {
          value.forEach(function (v) {
            that.store.addTriple(uri, vocab.uriFor(key), N3Util.createLiteral(v));
          });
        } else {
          this.store.addTriple(uri, vocab.uriFor(key), N3Util.createLiteral(value));
        }
      }

      for (var key in this.references) {
        var values = this.references[key];

        values.forEach(function (value) {
          if (value.getUri) {
            that.store.addTriple(uri, vocab.uriFor(key), value.getUri());
          } else if (validUrl.isUri(value)) {
            that.store.addTriple(uri, vocab.uriFor(key), value);
          } else {
            that.store.addTriple(uri, vocab.uriFor(key), vocab.uriFor(value));
          }
        });
      }
    }
  };
})();

module.exports = Entity;
