# Doing more with LESS
Decided to switch to LESS instead of vanilla CSS because of a few key features that will help a ton when making theme files.
Using [Gulp.js](https://github.com/gulpjs/gulp) as the build tool here.

### Getting started
From root folder: `$ npm install`

This should install all the packages listed in `package.json`

### Using Gulp
To build once: `$ gulp less`

To turn on watching: `$ gulp watch`

### Items left to do:

- Setup livereload for dev purposes
- Split `less` task into two different tasks:
 - One without minification or sourcemaps
 - One with minification and sourcemaps

# List of Plugins

- `gulp-less` converts .less files to .css
- `gulp-autoprefixer` set to "last 2 versions" of all major browsers
- `gulp-cleanCSS` used for minification
- `gulp-watch` used to auto-build when changes are detected in /styles
- `gulp-sourcemaps` generates CSS sourcemaps, exposes LESS styles inside Chrome dev tools
- `gulp-livereload` Save the straing on your fingers!