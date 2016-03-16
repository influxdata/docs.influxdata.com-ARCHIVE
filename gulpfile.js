var gulp = require('gulp'),
    less = require('gulp-less'),
    livereload = require('gulp-livereload'),
    watch = require('gulp-watch');

gulp.task('less', function() {
   gulp.src('*.less')
      .pipe(watch())
      .pipe(less())
      .pipe(gulp.dest('static/css/docs-default.css'))
      .pipe(livereload());
});