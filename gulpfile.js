const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const gutil = require('gulp-util');
const pump = require('pump');

const sourceJs = [
  'src/**/*.js',
  './jsdoc.js',
];
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

// generates JSDoc from js files
gulp.task('jsdoc', plugins.shell.task('node node_modules/jsdoc/jsdoc.js ' +
  '-d doc ' +
  './README.md ' +
  '-r src jsdoc.js'));

// watch files for reload in dev mode
gulp.task('watch', () => {
  gulp.watch(sourceJs, ['jsdoc']);
});

// default task
gulp.task('default', ['jsdoc', 'watch']);
