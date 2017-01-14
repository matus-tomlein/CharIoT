var N3 = require('n3'),
    N3Util = N3.Util;

var Vocabulary = function Vocabulary() {
  this.prefix = 'http://matus.tomlein.org/case#';

  this.nodeUri = function (node) {
    return this.uriFor('node_' + node.id);
  };

  this.case = function (path) { return this.uriFor(path); };

  this.rdf = function (path) {
    return 'http://www.w3.org/1999/02/22-rdf-syntax-ns#' + path;
  };

  this.rdfVocabulary = function () {
    var vocab = new Vocabulary();
    vocab.prefix = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
    return vocab;
  };

  this.euler = function (path) {
    return 'http://eulersharp.sourceforge.net/2003/03swap/log-rules#' + path;
  };

  this.log = function (path) {
    return 'http://www.w3.org/2000/10/swap/log#' + path;
  };

  this.uriFor = function (path) {
    return this.prefix + path;
  };

  this.toList = function (node, store) {
    return appendToList(node, store, this, []);
  };
};

function appendToList(node, store, vocab, list) {
  var first = store.find(node, vocab.rdf('first'), null)[0];
  var rest = store.find(node, vocab.rdf('rest'), null)[0];

  if (first)
    list.push(N3Util.getLiteralValue(first.object));

  if (rest && rest.object != vocab.rdf('nil'))
    appendToList(rest.object, store, vocab, list);

  return list;
}

module.exports = new Vocabulary();
