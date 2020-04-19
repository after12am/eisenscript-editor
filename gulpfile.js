'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync');
const reload = browserSync.reload;

/**
 * start web app
 */
gulp.task('serve', () => {
  browserSync({
    notify: false,
    port: 9000,
    startPath: '/',
    open: 'external',
    server: {
      baseDir: ['.']
    }
  });

  gulp.watch([
    './**/*',
  ]).on('change', reload);
});
