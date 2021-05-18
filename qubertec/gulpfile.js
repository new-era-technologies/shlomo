const { src, dest, watch, series, parallel } = require('gulp'),
    browserSync = require('browser-sync').create(),
    del = require('gulp-clean'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    rigger = require('gulp-rigger'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    purge = require('gulp-css-purge'),
    minifyCss = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    jsValidate = require('gulp-jsvalidate'),
    merge = require('merge-stream');

sass.compiler = require('node-sass');

const CONFIGS = [
    require('./gulp.main-page.config'),
    require('./gulp.login.config')
];


function clean() {
    return src('app/build/**/*', { read: false })
        .pipe(del());
}

function clearCache() {
    return cache.clearAll();
}

function html() {
    let tasks = CONFIGS.map(
        config => {
            return src(config.html.src)
                .pipe(rigger())
                .pipe(dest(config.buildLocations.html))
                .pipe(browserSync.stream());
        }
    )
    return merge(tasks);
}

function fonts() {
    return src('app/src/assets/fonts/**/*.{eot,svg,ttf,woff,woff2}')
        .pipe(dest('app/build/assets/fonts/'));
}

function css() {
    let tasks = CONFIGS.map(
        config => {
            return src(config.sass.src)
                .pipe(autoprefixer({
                    cascade: false
                }))
                .pipe(sass().on('error', sass.logError))
                .pipe(purge())
                .pipe(concat('main.css'))
                .pipe(minifyCss())
                .pipe(dest(config.buildLocations.css))
                .pipe(browserSync.stream());
        }
    )
    return merge(tasks);
}

function javascript() {
    let tasks = CONFIGS.map(
        config => {
            return src(config.js.src)
                .pipe(jsValidate())
                .pipe(babel({
                    presets: ['@babel/env']
                }))
                .pipe(concat('main.js'))
                .pipe(uglify())
                .pipe(dest(config.buildLocations.js))
                .pipe(browserSync.stream());
        }
    )
    return merge(tasks);
}

function images() {
    return src('app/src/assets/img/**/*')
        .pipe(cache(imagemin([
            imagemin.svgo({
                plugins: [{
                    removeViewBox: true
                }]
            })
        ], {
            verbose: true
        })))
        .pipe(dest('app/build/assets/img'));
}

exports.default = function() {
    browserSync.init({
        server: { baseDir: "app/build" }
    });
    let watchArr = [];
    CONFIGS.forEach(config => {
        let srcItms = [config.html.tmp, config.sass.tmp, config.js.src];
        watchArr.push(...srcItms);
    });
    watch(watchArr, series(
        clean,
        // clearCache,
        images,
        fonts,
        parallel(html, css, javascript))).on('change', browserSync.reload);
};