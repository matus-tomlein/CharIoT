var N3 = require('n3');

var SemanticRule = function SemanticRule(precondition, postcondition) {
  this.id = Math.random().toString(36).substring(7);
  this.precondition = precondition || [];
  this.postcondition = postcondition || [];
  this.childRules = [];
  this.satisfiesPropertyTypes = [];
  this.requiresPropertyTypes = [];
};

SemanticRule.prototype.toN3 = function toN3(callback) {
  var that = this;
  var postcondition = that.postcondition.concat(that.childRules);

  if (that.precondition.length) {
    writeTriples(that.precondition, function (err, pre) {
      if (err) {
        callback(err, null);
      } else {
        writeTriples(postcondition, function (err, post) {
          if (err) {
            callback(err, null);
          } else {
            var rule = '{\n' + pre + '} => {\n' + post + '}.\n';
            rule = rule.replace(/\<\?([\w\.]+)\>/g, '?$1');
            callback(null, rule);
          }
        });
      }
    });
  } else if (postcondition.length) {
    writeTriples(postcondition, callback);
  } else {
    callback(null, '');
  }
};

SemanticRule.prototype.addChildRule = function (rule) {
  this.childRules.push(rule);
};

SemanticRule.prototype.hasPostconditionItems = function () {
  return this.postcondition.length > 0;
};

SemanticRule.prototype.hasChildRules = function () {
  return this.childRules.length > 0;
};

function writeTriples(triples, callback) {
  try {
    var writer = N3.Writer();
    var rules = [];

    triples.forEach(function (triple) {
      if (triple.toN3) {
        rules.push(triple);
      } else if (typeof triple == 'string') {
        rules.push(triple);
      } else {
        writer.addTriple(triple[0], triple[1], triple[2]);
      }
    });

    writer.end(function (err, written) {
      if (err) {
        callback(err);
      } else {
        rulesToN3(rules, [written], function (err, result) {
          callback(err, result.join(''));
        });
      }
    });
  } catch (err) {
    console.log(err.message);
    console.error(err.stack);
  }
}

function rulesToN3(rules, n3, callback) {
  var rule = rules.pop();

  if (rule) {
    rule.toN3(function (err, result) {
      if (err) {
        callback(err, null);
      } else {
        n3.push(result);
        rulesToN3(rules, n3, callback);
      }
    });
  } else {
    callback(null, n3);
  }
}

module.exports = SemanticRule;
