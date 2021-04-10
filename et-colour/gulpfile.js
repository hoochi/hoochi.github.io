"use strict";

const autoprefixer = require("autoprefixer");
const browsersync = require("browser-sync").create();
const cssnano = require("cssnano");
const del = require("del");
const eslint = require("gulp-eslint");
const gulp = require("gulp");
const minify = require("gulp-minify");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const sass = require("gulp-sass");

function browserSync(done) {
   browsersync.init({
     server: { baseDir: "./dist" },
     startPath: "./"
   });
   done();
 }

 function browserSyncReload(done) {
   browsersync.reload();
   done();
 }

function clean() {
   return del(["./dist/**"]);
}

function css() {
   return gulp
      .src("./app/scss/**/*.scss")
      .pipe(plumber())
      .pipe(sass({ outputStyle: "expanded" }))
      .pipe(rename({ suffix: ".min" }))
      .pipe(postcss([autoprefixer(), cssnano()]))
      .pipe(gulp.dest("./dist/css/"))
      .pipe(browsersync.stream());
};


function lintJS() {
   return gulp
     .src("./app/js/**/*")
     .pipe(plumber())
     .pipe(eslint({
        "rules": {
            "eqeqeq": "warn",
            "curly": "warn",
            "quotes": ["warn", "double"]
        }
      }))
     .pipe(eslint.format())
     .pipe(eslint.failAfterError());
 }

function minJS() {
   return gulp
      .src("./app/js/**/*")
      .pipe(plumber())
      .pipe(minify({
         "noSource": true,
         "ext": { "min": ".min.js" }
      }))
      .pipe(gulp.dest("dist/js/"))
      .pipe(browsersync.stream());
}

function copyHtml() {
   return gulp
      .src("./app/*.html", { base: './app'})
      .pipe(gulp.dest("./dist/"));
}


function copyStatic() {
   return gulp
      .src("./app/favicon.ico", { base: './app'})
      .pipe(gulp.dest("./dist/"));
}

// Watch files
function watchFiles() {
   gulp.watch("./app/scss/**/*", css);
   gulp.watch("./app/js/**/*", gulp.series(lintJS, minJS));
   gulp.watch("./app/*.html", gulp.series(copyHtml,browserSyncReload));
}



 // complex tasks
const build = gulp.series(
   clean,
   gulp.parallel(copyHtml,copyStatic),
   gulp.parallel(css, gulp.series(lintJS,minJS)),
   gulp.parallel(watchFiles,browserSync));

const buildNoSync = gulp.series(
   clean,
   gulp.parallel(copyHtml,copyStatic),
   gulp.parallel(css, gulp.series(lintJS,minJS)));
   
// exported tasks
exports.clean = clean;
exports.default = build;
exports.nosync = buildNoSync;
