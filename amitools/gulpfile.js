const { series, parallel, src, dest, watch } = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const del = require('del');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const cleanCss = require('gulp-clean-css');
const jshint = require('gulp-jshint');
const reporter = require('jshint-stylish');

function clean() {
   return del(['dist/**', 'dist/']);
}

function content() { return src('app/content/**').pipe(dest('dist/content')); }
function root() { return src('app/*.*').pipe(dest('dist/')); }
function libs() { return src('app/lib/**').pipe(dest('dist/lib/')); }

function buildjs(cb) {
   return src('app/js/*.js')
      .pipe(uglify())
      .pipe(rename({ extname: '.min.js'}))
      .pipe(dest('dist/js'));
}

function buildcss(cb) {
   return src('app/scss/**/*')
      .pipe(sass())
      .pipe(cleanCss())
      .pipe(rename({ extname: ".min.css"}))
      .pipe(dest('dist/css'));
}


function sync(cb) {
   browserSync.init({
      server: { baseDir: 'dist/' }
   });
   cb();
}

function watchFiles(cb) {
   watch(['app/js/**/*']).on('change', function() {
      buildjs().pipe(browserSync.stream());
   });

   watch(['app/scss/**/*']).on('change', function() {
      buildcss().pipe(browserSync.stream());
   });

   watch(['app/*.*']).on('change', function(filename) {
      src(filename)
         .pipe(rename(function(path) {
            path.dirname = '';
            return path;
         }))
         .pipe(dest('dist/'))
         .pipe(browserSync.stream());
   });

   watch(['app/content/**']).on('change', function() {
      content().pipe(browserSync.stream());
   });

   cb();
}

exports.clean = clean;
exports.sync = series (
   clean,
   parallel(content,root,libs,buildjs,buildcss),
   sync,
   watchFiles
);
exports.default = series (
   clean,
   parallel(content,root,libs,buildjs,buildcss)
);
