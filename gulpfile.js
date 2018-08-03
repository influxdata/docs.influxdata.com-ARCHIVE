var gulp = require('gulp'),
	autoprefix = require('gulp-autoprefixer'),
	cleanCSS = require('gulp-clean-css'),
	less = require('gulp-less'),
	livereload = require('gulp-livereload'),
	sourcemaps = require('gulp-sourcemaps'),
	watch = require('gulp-watch');

gulp.task('less', function(done) {
	gulp.src('styles/docs-default.less')
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(cleanCSS())
		.pipe(autoprefix('last 2 version'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('static/css/'))
		.pipe(livereload())
	gulp.src('styles/docs-light.less')
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(cleanCSS())
		.pipe(autoprefix('last 2 version'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('static/css/'))
		.pipe(livereload())
		done()
});

gulp.task('watch', function () {
	livereload.listen();
	gulp.watch('styles/{*.less,*.css}', gulp.series('less'));
});
