var fs = require('fs');
var browserify = require('browserify');
var watchify = require('watchify');

var b = browserify('./components/app.jsx')
  .transform('babelify', {presets: ['es2015', 'react']})
  .plugin(watchify)
  .on('update', bundle);

bundle([]);

function bundle(ids) {
  console.log('Changed bundles: ' + ids.join(' '));
  b.bundle()
    .on('error', function(err){
      console.log(err.message);
      this.emit('end');
    })
    .pipe(fs.createWriteStream('./public/app/index.js'));
}
