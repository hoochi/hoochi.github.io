(function() {
   "use strict";

   var gulp = require("gulp");
   var sass = require("gulp-sass");
   var rename = require("gulp-rename");
   var cleanCss = require("gulp-clean-css");
   var rimraf = require("gulp-rimraf");
   var jshint = require("gulp-jshint");
   var uglify = require("gulp-uglify");
   var browserSync = require("browser-sync").create();
   var reporter = require("jshint-stylish");

   gulp.task("browserSync", function() {
      browserSync.init({
         files: ['./app/index.html', './app/js/*.min.js', './app/css/*.css'],
         server: {
            baseDir: 'app'
         }
      });
   });

   gulp.task("clean:css", function(cb) {
      return gulp
         .src("./app/css/*.css")
         .pipe(rimraf());
   });

   gulp.task("sass", ["clean:css"], function(cb) {
      return gulp
         .src("./app/scss/*.scss")
         .pipe(sass())
         .pipe(rename({ extension: ".css"}))
         .pipe(gulp.dest("./app/css"));
   });

   gulp.task("minify:css", ["sass"], function(cb) {
      return gulp
         .src(["./app/css/*.css","!./app/css/*.min.css"])
         .pipe(cleanCss())
         .pipe(rename({ suffix: ".min"}))
         .pipe(gulp.dest("./app/css"));
   });

   gulp.task("build:css", ["minify:css"], function(cb) {
      return gulp
         .src(["./app/css/*.css","!./app/css/*.min.css"])
         .pipe(rimraf());
   });

   gulp.task("clean:scripts", function(cb) {
      return gulp
         .src("./app/js/*.min.js")
         .pipe(rimraf());
   });

   gulp.task("lint:scripts", ["clean:scripts"], function(cb) {
      return gulp
         .src("./app/js/dev/*.js")
         .pipe(jshint())
         .pipe(jshint.reporter(reporter));
   });

   gulp.task("build:scripts", ["lint:scripts"], function(cb) {
      return gulp
         .src("./app/js/dev/*.js")
         .pipe(uglify())
         .pipe(rename({suffix: ".min"}))
         .pipe(gulp.dest("./app/js"));
   });


   gulp.task("watch", function(cb) {
      gulp.watch("./app/scss/*.scss", ["build:css"]);
      gulp.watch("./app/js/dev/*.js", ["build:scripts"]);
   });


   gulp.task("default", ["watch", "browserSync"], function(cb) {
   });
}());
