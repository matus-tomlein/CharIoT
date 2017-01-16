var N3 = require('n3'),
    crypto = require('crypto'),
    _ = require('underscore'),
    vocab = require('./vocabulary');

function hashString(str) {
  return crypto.createHash('md5').update(str || '').digest('hex');
}

class TriplesProcessor {

  fromDefinition(definition, callback) {
    var parser = N3.Parser();
    var ignored = {};
    var triples = [];
    var removed = 0;

    parser.parse(definition, (error, triple) => {
      if (triple) {
        if (triple.predicate == vocab.case('ignore')) {
          ignored[triple.subject] = true;
          removed++;
        } else {
          triples.push(triple);
        }
      } else {
        this.triples = _.select(triples, (triple) => {
          if (ignored[triple.subject] || ignored[triple.object])
            return false;
          return true;
        });

        callback(null);
      }
    });
  }

  convertToNamedNodes() {
    var reasoningId = Math.random().toString(36).substring(7);
    this.triples = this.triples.map((triple) => {
      triple.subject = this._toNamedNode(reasoningId, triple.subject);
      triple.object = this._toNamedNode(reasoningId, triple.object);
      return triple;
    });
  }

  toArrayFormat() {
    return this.triples.map((triple) => {
      return [triple.subject, triple.predicate, triple.object];
    });
  }

  toStore(callback) {
    let store = N3.Store();
    this.triples.forEach((triple) => {
      store.addTriple(triple.subject, triple.predicate, triple.object);
    });

    callback(null, store);
  }

  serialize(callback) {
    var writer = N3.Writer({ prefixes: { case: vocab.case('') } });
    this.triples.forEach((triple) => {
      writer.addTriple(triple);
    });

    writer.end(callback);
  }

  _toNamedNode(reasoningId, str) {
    const regex = /^_:/g;
    if (regex.exec(str) !== null)
      return 'http://was.blank/' + hashString(reasoningId + '_' + str);
    return str;
  }

}

module.exports = TriplesProcessor;
