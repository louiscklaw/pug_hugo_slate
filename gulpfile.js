/* File: gulpfile.js */
/* jshint node: true */
'use strict';

const path = require( 'path' );
var browserSync = require('browser-sync').create();

// grab our packages
var gulp = require( 'gulp' );
var jshint = require( 'gulp-jshint' );
var uglify = require( 'gulp-uglify' );
var concat = require( 'gulp-concat' );
var rename = require( 'gulp-rename' );
var autoprefixer = require( 'gulp-autoprefixer' );
var runSequence = require( 'run-sequence' );
var sass = require( 'gulp-sass' );
var cleanCss = require( 'gulp-clean-css' );
var hash = require( 'gulp-hash' );
var webserver = require( 'gulp-webserver' );
var del = require( 'del' );
var util = require( 'gulp-util' );
var plumber = require( 'gulp-plumber' );
var pug = require( 'gulp-pug' );

var src = './app/client',
    pug_home = './app/client',
    pug_inc = path.join(pug_home,'pug_inc'),
    vnd = './vendor',
    docs = './docs',
    _static = './static',
    dst = docs,
    scssSrc = src + '/scss',
    scssVnd = vnd + '/scss',
    scssDst = dst + '/css',
    pug_dst = dst,
    jsSrc = src + '/js',
    jsVnd = vnd + '/js',
    jsDst = dst + '/js',
    fontDst = dst + '/fonts';


gulp.task( 'build', function ( callback ) {
    runSequence( 'vendor', 'pack-css', 'pack-js', 'pug_compile');
} );

gulp.task( 'pack-js', function () {
    return gulp.src( [jsVnd + '/**/*.js', jsSrc + '/**/*.js'] )
        .pipe(plumber())
        .pipe( concat( 'slate.js' ) )
        .pipe( util.env.debug ? util.noop() : uglify() )
        .pipe( gulp.dest( jsDst ) );
} );

gulp.task( 'pack-css', function () {
    console.log( scssVnd );
    return gulp.src( [ scssVnd + '/**/*.css',
            scssVnd + '/**/*.scss',
            scssSrc + '/**/*.css',
            scssSrc + '/**/*.scss'
    ] )
        .pipe(plumber())
        .pipe( sass( {
            outputStyle: 'compressed',
            errLogToConsole: true
        } ) )
        .pipe( concat( 'slate.css' ) )
        .pipe( cleanCss() )
        .pipe( gulp.dest( scssDst ) );
} );

gulp.task( 'pug_compile', function ( done ) {

    return gulp.src( [pug_home + '/**/*.pug'] )
        .pipe(plumber())
        .pipe( pug() )
        .pipe( gulp.dest( pug_dst ) );
})

gulp.task( 'vendor', function () {
    // del([scssDst + '/font-awesome.*', fontDst]);
    gulp.src( [ './node_modules/font-awesome/css/font-awesome.css' ] )
        .pipe( gulp.dest( scssVnd ) );

    gulp.src( [ './node_modules/font-awesome/fonts/*' ] )
        .pipe( gulp.dest( fontDst ) );

    gulp.src( [ './node_modules/shufflejs/dist/shuffle.js' ] )
        .pipe( gulp.dest( jsVnd ) );

    gulp.src( [ './node_modules/tinycolor2/tinycolor.js' ] )
        .pipe( gulp.dest( jsVnd ) );
} );

gulp.task( 'browserSyncReload', function () {
    browserSync.reload();
})

gulp.task('watch', function() {
    runSequence( 'pack-css', 'pack-js' );
    console.log( scssSrc + '/**/*css' );

    gulp.watch([scssSrc + '/**/*css', scssSrc+'/*'], ['pack-css']);
    gulp.watch(jsSrc + '/**/*.js', ['pack-js']);
    gulp.watch([pug_home] + '/**/*.pug', ['pug_compile', 'browserSyncReload']);
});

gulp.task('browserSyncInit', function() {
    browserSync.init({
        server: {
            baseDir: "./docs"
        }
    });
});

// define the default task and add the watch task to it
gulp.task( 'default', [ 'build' ] );

// gulp.task( 'serve', [ 'watch' ], function () {
//     gulp.src( dst )
//         .pipe( webserver( {
//             livereload: true,
//             directoryListing: false,
//             open: true,
//             fallback: 'index.html'
//         } ) );
// } );

gulp.task( 'serve', ['watch', 'browserSyncInit'] );
