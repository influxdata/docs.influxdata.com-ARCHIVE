var gulp = require('gulp'),
    less = require('gulp-less'),
    autoprefix = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload'),
    watch = require('gulp-watch'),
    cleanCSS = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('less', function() {
   gulp.src('*.less')
      .pipe(watch())
      .pipe(less())
      .pipe(sourcemaps.init())
      .pipe(cleanCSS())
      .pipe(sourcemaps.write())
      .pipe(autoprefix('last 2 version', 'ie 8', 'ie 9'))
      .pipe(gulp.dest('static/css/docs-default.css'))
      .pipe(livereload());
});