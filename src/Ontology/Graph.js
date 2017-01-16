var SemanticRule = require('./SemanticRule');

function Graph(items) {
  this.items = items;
}

Graph.prototype.toN3 = function (callback) {
  var rule = new SemanticRule();
  rule.postcondition = this.items;

  rule.toN3(function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, '{\n' + result + '}\n');
    }
  });
};

module.exports = Graph;
