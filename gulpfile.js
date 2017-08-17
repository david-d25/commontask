'use strict';

var gulp = require('gulp'),
  watch = require('gulp-watch'),
  prefixer = require('gulp-autoprefixer'),
  uglify = require('gulp-uglify'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  rigger = require('gulp-rigger'),
  cssmin = require('gulp-clean-css'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  rimraf = require('rimraf');

var path = {
  build: {
    html: 'build/',
    php: 'build/',
    js: 'build/js/',
    css: 'build/css/',
    img: 'build/img/',
    json: 'build/json/',
    video: 'build/video',
    fonts: 'build/'
  },
  src: {
    html: 'src/*.html',
    php: 'src/*.php',
    js: 'src/js/*.js',
    style: 'src/styles/*.+(scss|css)',
    json: 'src/json/**/*.json',
    img: 'src/img/**/*.+(jpg|jpeg|png|bmp|gif)',
    video: 'src/video/**/*.*',
    fonts: 'src/**/*.+(ttf|woff)'
  },
  watch: {
    html: 'src/**/*.html',
    php: 'src/**/*.php',
    js: 'src/js/**/*.js',
    json: 'src/json/**/*.json',
    style: 'src/styles/**/*.+(scss|css)',
    img: 'src/img/**/*.*',
    video: 'src/video/**/*.*',
    fonts: 'src/**/*.+(ttf|woff)'
  },
  clean: './build'
};

gulp.task('html:build', function() {
  gulp.src(path.src.html)
    .pipe(rigger())
    .on('error', errorHandler)
    .pipe(gulp.dest(path.build.html))
    .on('error', errorHandler);
});
gulp.task('php:build', function() {
  gulp.src(path.src.php)
    .pipe(gulp.dest(path.build.php))
    .on('error', errorHandler);
});
gulp.task('js:build', function () {
  gulp.src(path.src.js)
    .pipe(rigger())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .on('error', errorHandler)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.js))
    .on('error', errorHandler);
});
gulp.task('json:build', function() {
  gulp.src(path.src.json)
    .pipe(gulp.dest(path.build.json));
});
gulp.task('video:build', function() {
  gulp.src(path.src.video)
    .pipe(gulp.dest(path.build.video));
});
gulp.task('style:build', function () {
  gulp.src(path.src.style)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on('error', errorHandler)
    .pipe(prefixer())
    .on('error', errorHandler)
    .pipe(cssmin())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.css));
});
gulp.task('image:build', function () {
  gulp.src(path.src.img)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()],
      interlaced: true
    }))
    .pipe(gulp.dest(path.build.img)) 
    .on('error', errorHandler);
});
gulp.task('fonts:build', function() {
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
    .on('error', errorHandler);
});

gulp.task('build', [
  'html:build',
  'js:build',
  'php:build',
  'style:build',
  'fonts:build',
  'json:build',
  'video:build',
  'image:build'
]);

gulp.task('watch', function(){
  watch([path.watch.html], function(event, cb) {
    gulp.start('html:build');
  });
  watch([path.watch.php], function(event, cb) {
    gulp.start('php:build');
  });
  watch([path.watch.style], function(event, cb) {
    gulp.start('style:build');
  });
  watch([path.watch.js], function(event, cb) {
    gulp.start('js:build');
  });
  watch([path.watch.img], function(event, cb) {
    gulp.start('image:build');
  });
  watch([path.watch.fonts], function(event, cb) {
    gulp.start('fonts:build');
  });
  watch([path.watch.video], function(event, cb) {
    gulp.start('video:build');
  });
  watch([path.watch.json], function(event, cb) {
    gulp.start('json:build');
  });
});

gulp.task('clean', function (cb) {
  rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'watch']);

function errorHandler(error) {
  console.log("Error:\n" + error.toString());
  this.emit('end');
}