const gulp = require('gulp');

const cssnano = require('gulp-cssnano');
const babel = require('gulp-babel');
const useref = require('gulp-useref');
const uglify = require('gulp-uglify');
const gulpIf = require('gulp-if');
const htmlmin = require('gulp-htmlmin');


const browserSync = require('browser-sync').create();

const paths = {
    scripts: './public/scrips/*.js',
    styles: './public/styles/*.css',
    html: './public/index.html',
    all: './public/**/*.*'
};

gulp.task('browser-sync', () => {
    browserSync.init({
        proxy: 'localhost:2579',
        port: 3469,
        open: false
    });
    gulp.watch(paths.all, () => {
        browserSync.reload();
    });
});

const babelCFG = {
    presets: ['es2015']
};

gulp.task('build', () => {
    return gulp.src('./public/index.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', babel(babelCFG)))
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulpIf('*.html', htmlmin({ collapseWhitespace: true })))
        .pipe(gulp.dest('./build'));
});
