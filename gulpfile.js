var gulp = require('gulp');
var webserver = require('gulp-webserver');
var merge = require('merge-stream');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyhtml = require('gulp-minify-html');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');
var gutil = require('gulp-util');

var src = '';
var dist = 'dist/static';
var app_dist = 'app/api/static';

var paths = {
    assets: src + 'assets/**/*',
    bootstrap: src + 'bootstrap/**/*',
	ui: src + 'ui/**/*',
	jasmine: src + 'jasmine-2.4.1/**/*',
	spec: src + 'spec/**/*',
    //html: src + 'html/**/*',
    //js: src + 'js/**/*',
    //css: src + 'css/**/*',
    img: src + 'img/**/*',
    fonts: src + 'font/*.*',
};

gulp.task('server', function() {
  return gulp.src(dist + '/')
  	.pipe(webserver({
		livereload: true,
		host: '0.0.0.0',
        port: 8888,
		fallback: 'index.html',
	}));
});

gulp.task('copy', function() {
	var assets = gulp.src(paths.assets)
		.pipe(gulp.dest(dist+'/assets'));

	var bootstrap = gulp.src(paths.bootstrap)
		.pipe(gulp.dest(dist+'/bootstrap'));

	var ui = gulp.src(paths.ui)
		.pipe(gulp.dest(dist+'/ui'));

	var jasmine = gulp.src(paths.jasmine)
		.pipe(gulp.dest(dist+'/jasmine-2.4.1'));

	var spec = gulp.src(paths.spec)
		.pipe(gulp.dest(dist+'/spec'));
/*
	var html = gulp.src(paths.html)
		.pipe(gulp.dest(dist));

	var js = gulp.src(paths.js)
	//	.pipe(uglify().on('error', gutil.log))
		.pipe(gulp.dest(dist+'/js'));

	var css = gulp.src(paths.css)
		.pipe(gulp.dest(dist+'/css'));
*/
	var img = gulp.src(paths.img)
		.pipe(gulp.dest(dist+'/img'));

	var fonts = gulp.src(paths.fonts)
		.pipe(gulp.dest(dist+'/fonts'));

	//return merge(assets, bootstrap, ui, jasmine, spec, html, js, css, img, fonts);
	return merge(assets, bootstrap, ui, jasmine, spec, img, fonts);
});

gulp.task('app_copy', function() {
	var assets = gulp.src(paths.assets)
		.pipe(gulp.dest(app_dist+'/assets'));

	var bootstrap = gulp.src(paths.bootstrap)
		.pipe(gulp.dest(app_dist+'/bootstrap'));

	var ui = gulp.src(paths.ui)
		.pipe(gulp.dest(app_dist+'/ui'));

	var img = gulp.src(paths.img)
		.pipe(gulp.dest(app_dist+'/img'));

	var fonts = gulp.src(paths.fonts)
		.pipe(gulp.dest(app_dist+'/fonts'));

	//return merge(assets, bootstrap, ui, spec, html, js, css, img, fonts);
	return merge(assets, bootstrap, ui, spec, js, css, img, fonts);
});

gulp.task('watch', function(){
  livereload.listen();
  gulp.watch(paths.html, ['copy']);
  gulp.watch(paths.js, ['copy']);
  gulp.watch(paths.css, ['copy']);
  gulp.watch(paths.spec, ['copy']);
  gulp.watch(dist + '/**').on('change', livereload.changed);
});

gulp.task('default', ['copy', 'app_copy', 'watch', 'server']);
