'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync').create();

gulp.task('browser-sync', function (done) {
  browserSync.reload();
  done();
});

gulp.task('serve', function () {

  // Serve files from the root of this project
  browserSync.init({
    open: true,
    port: 9000,
    server: {
      baseDir: "./app"
    },
  });

  gulp.watch('app/**/*', ['browser-sync']);
});
