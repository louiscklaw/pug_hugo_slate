/* File: gulpfile.js */
/* jshint node: true */
'use strict';

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


var src = './app/client/scss',
    vnd = './vendor',
    docs = './docs',
    _static = './static',
    dst = docs,
    scssSrc = src + '/scss',
    scssVnd = vnd + '/scss',
    scssDst = dst + '/css',
    jsSrc = src + '/js',
    jsVnd = vnd + '/js',
    jsDst = dst + '/js',
    fontDst = dst + '/fonts';


gulp.task( 'build', function ( callback ) {
    runSequence( 'vendor', 'pack-css', 'pack-js' );
} );

gulp.task( 'pack-js', function () {
    return gulp.src( [ jsVnd + '/**/*.js', jsSrc + '/**/*.js' ] )
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
        .pipe( sass( {
            outputStyle: 'compressed',
            errLogToConsole: true
        } ) )
        .pipe( concat( 'slate.css' ) )
        .pipe( cleanCss() )
        .pipe( gulp.dest( scssDst ) );
} );


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

// define the default task and add the watch task to it
gulp.task( 'default', [ 'build' ] );

gulp.task( 'serve', [ 'watch' ], function () {
    gulp.src( dst )
        .pipe( webserver( {
            livereload: true,
            directoryListing: false,
            open: true,
            fallback: 'index.html'
        } ) );
} );
