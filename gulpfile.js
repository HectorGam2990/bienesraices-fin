const { src, dest, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const terser = require('gulp-terser-js');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const webp = require('gulp-webp');

const paths = {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    imagenes: 'src/img/**/*',
    html: '*.html'
};

// ================= CSS =================
function css() {
    return src(paths.scss)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([
            autoprefixer(),
            cssnano()
        ]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./build/css'));
}

// ================= JS =================
function javascript() {
    return src(paths.js)
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.js'))
        .pipe(terser())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./build/js'));
}

// ================= IMÁGENES =================
function imagenes() {
    return src(paths.imagenes)
        .pipe(cache(imagemin({ optimizationLevel: 3 })))
        .pipe(dest('./build/img'));
}

// ================= WEBP =================
function versionWebp() {
    return src(paths.imagenes)
        .pipe(webp())
        .pipe(dest('./build/img'));
}

// ================= HTML =================
function html() {
    return src(paths.html)
        .pipe(dest('./build'));
}

// ================= BUILD PARA NETLIFY =================
exports.build = parallel(css, javascript, imagenes, versionWebp, html);
exports.default = exports.build;
