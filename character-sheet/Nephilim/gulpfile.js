const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sass = require("gulp-sass");
const { src, dest, watch, task, series} = require("gulp");
const pug = require("gulp-pug");

function compile_sass() {
   return src('src/stylesheets/*.sass')
        .pipe(sass())
        .pipe(concat('Nephilim_Legende.css'))
        .pipe(dest("."))
}

function compile_pug() {
   return src('src/skeletons/Nephilim_Legende.pug')
       .pipe(pug({
          pretty: true
       }))
       .pipe(dest("."))
}

function compile_pug_dev() {
   return src('src/skeletons/dev-sheet.pug')
       .pipe(pug({
          pretty: true
       }))
       .pipe(dest("./dev"))
}

task("my_watch", function() {
   watch("src/stylesheets/*.sass", compile_sass);
   watch("src/htmls/*", series(compile_pug, compile_pug_dev));
});