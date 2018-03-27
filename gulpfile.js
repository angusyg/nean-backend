const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

const sourceJs = [
  'src/**/*.js',
  './jsdoc.js',
];

gulp.task('jsdoc', plugins.shell.task('node node_modules/jsdoc/jsdoc.js ' +
  '-d doc ' +
  './README.md ' +
  '-r src jsdoc.js'));

// watch files for reload in dev mode
gulp.task('watch', () => {
  gulp.watch(sourceJs, ['jsdoc']);
});

// default task (production)
gulp.task('default', ['copy-js-lib', 'html', 'sass', 'uglify', 'connect', 'watch']);
gulp.task('postinstall', ['sass', 'uglify']);
