import fs from 'fs';
import path from 'path';

function walk(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          if (file.includes('node_modules') || file.includes('.git')) {
            if (!--pending) done(null, results);
            return;
          }
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          const ext = path.extname(file).toLowerCase();
          if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
            results.push(file);
          }
          if (!--pending) done(null, results);
        }
      });
    });
  });
}

walk('/app/applet', function(err, results) {
  if (err) throw err;
  console.log(results.join('\n'));
});
