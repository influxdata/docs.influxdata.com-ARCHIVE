var gulp = require('gulp'),
	autoprefix = require('gulp-autoprefixer'),
	cleanCSS = require('gulp-clean-css'),
	less = require('gulp-less'),
	livereload = require('gulp-livereload'),
	sourcemaps = require('gulp-sourcemaps'),
	watch = require('gulp-watch');

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