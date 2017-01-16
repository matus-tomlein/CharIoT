const TriplesProcessor = require('./TriplesProcessor'),
      Eye = require('./Eye'),

      async = require('async'),
      N3 = require('n3'),
      fs = require('fs');

class Reasoner {
  constructor() {
    this.rules = [];
    this.files = [];
    this.stores = [];
  }

  addSemanticRule(semanticRule) {
    this.rules.push(semanticRule);
  }

  addFileSource(file) {
    this.files.push(file);
  }

  addStore(store) {
    this.stores.push(store);
  }

  serializeSources(callback) {
    this.serializeRules((err, serializedRules) => {
      if (err) { callback(err); return; }
      var rule = serializedRules.join('\n\n');

      this.readFiles((err, files) => {
        if (err) { callback(err); return; }

        this.serializeStores((err, stores) => {
          var sources = [rule];
          sources = sources.concat(files).concat(stores);
          callback(null, sources);
        });
      });
    });
  }

  serializeRules(callback) {
    async.map(this.rules, (rule, done) => {
      rule.toN3(done);
    }, callback);
  }

  serializeStores(callback) {
    async.map(this.stores, (store, done) => {
      var writer = N3.Writer({ prefixes: {} });
      store.find().forEach((triple) => {
        writer.addTriple(triple);
      });
      writer.end(done);
    }, callback);
  }

  readFiles(callback) {
    async.map(this.files, (path, done) => {
      fs.exists(path, (exists) => {
        if (exists) {
          fs.readFile(path, 'utf8', done);
        } else {
          done('Not found');
        }
      });
    }, callback);
  }

  reason(callback) {
    this.serializeSources((err, sources) => {
      var eye = new Eye();

      eye.execute({ data: sources }, (err, output) => {
        if (err) {
          callback(err);
        } else {
          var triplesProcessor = new TriplesProcessor();

          triplesProcessor.fromDefinition(output, (err) => {
            if (err) {
              callback(err);
            } else {
              triplesProcessor.convertToNamedNodes();
              triplesProcessor.toStore(callback);
            }
          });
        }
      });
    });
  }
}

module.exports = Reasoner;
