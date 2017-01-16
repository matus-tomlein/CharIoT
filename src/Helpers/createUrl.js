var hashString = require('./hashString');

module.exports = (str) => {
  return 'http://generated.uri/' + hashString(str);
};
