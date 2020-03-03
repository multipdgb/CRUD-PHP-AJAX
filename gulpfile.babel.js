const gulp = require("gulp")
const pug = require("gulp-pug")
const sass = require("gulp-sass")
const autoprefixer = require("gulp-autoprefixer")
const uglify = require("gulp-uglify")
const browserSync = require("browser-sync").create()
const babel = require("gulp-babel")
const concat = require('gulp-concat')


gulp.task('pug', () => {
    return gulp.src("./src/views/*.pug", {
            allowEmpty: true
        })
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest("./public/"))
})
gulp.task('sass', () => {
    return gulp.src("./src/scss/index.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 3 versions']
        }))
        .pipe(gulp.dest("./public/css/"))
        .pipe(browserSync.stream())
})
gulp.task('babel', () => {

})

gulp.task('default', () => {
    browserSync.init({
        server: "./public"
    })

    gulp.watch(["./src/scss/*.scss", "./src/scss/components/*.scss"], gulp.series('sass'))
    gulp.watch("./src/views/*.pug", gulp.series('pug')).on('change', browserSync.reload)
    gulp.watch("./src/js/*.*"), gulp.series('default', 'pug')

    return gulp.src("./src/js/*.js")
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest("./src/js/es5/"))
        .pipe(gulp.src("./src/js/es5/*.js"))
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest("./public/js/"))
})