const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const gutil = require('gulp-util');
const pump = require('pump');

const lintJs = ['src/**/*.js'];
const pumpPromise = streams => new Promise((resolve, reject) => {
  pump(streams, (err) => {
    if (err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
      reject(err);
    } else resolve();
  });
});

// validates js files
gulp.task('lint', () => pumpPromise([
  gulp.src(lintJs),
  plugins.eslint(),
  plugins.eslint.format('stylish'),
  plugins.eslint.failAfterError(),
]));


// default task
gulp.task('default', []);
