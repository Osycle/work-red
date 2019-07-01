


var gulp 					= require('gulp'),
		del							= require('del'),
		browserSync 		= require('browser-sync'),
		sass 						= require('gulp-sass'),
		concat					= require('gulp-concat'),
		uglify					= require('gulp-uglifyjs'),
		cssnano					= require('gulp-cssnano'),
		rename					= require('gulp-rename'),
		imagemin				= require('gulp-imagemin'),
		cache						= require('gulp-cache'),
		autoprefixer		= require('gulp-autoprefixer');
		
var app = "app";

// OPTI-IMAGES
gulp.task('img', () =>
	gulp.src(app+'/img/**/*/')
		.pipe( cache(imagemin([
						imagemin.gifsicle({interlaced: true}),
						imagemin.jpegtran({progressive: true}),
						imagemin.optipng({optimizationLevel: 5}),
						imagemin.svgo({plugins: [{removeViewBox: true}]})
					])) )
		.pipe( gulp.dest('dist/img') )
);




// SASS
gulp.task('sass', () =>
	{
	return gulp.src( app+'/scss/**/*.+(scss|sass)' )
			.pipe( sass().on('error', sass.logError) )
			.pipe( autoprefixer( {browsers: 'last 15 versions', cascade: false} ) )
			.pipe( gulp.dest(app+'/css/') )
			.pipe( browserSync.reload({stream:true}) );
	}
);



// SCRIPTS
gulp.task('scripts', () =>
	{	
	return gulp.src([
			app+'/js/plugins/jquery.min.js',
			//app+'/js/plugins/jquery-ui.js',
			//app+'/js/plugins/skrollr.min.js',
			//app+'/js/plugins/smoothscroll.js',
			app+'/js/plugins/bootstrap.min.js',
			//app+'/js/plugins/howler.js', 
			//app+'/js/plugins/TweenMax.min.js',
			//app+'/js/plugins/EasePack.min.js', 
			//app+'/js/plugins/TextPlugin.min.js',
			//app+'/js/plugins/konva.min.js',
			//app+'/js/plugins/KonvaPlugin.js',
			//app+'/js/plugins/jquery.fractionslider.js',
			//app+'/js/plugins/pana-accordion.js',
			//app+'/js/plugins/jquery.vi.js',
			app+'/js/plugins/aos.js',
			//app+'/js/plugins/wow.js',
			app+'/js/plugins/owl.carousel.min.js',
			app+'/js/plugins/jquery.fancybox.js',
			//app+'/js/plugins/jquery.jcarousel.js',
			//app+'/js/plugins/classie.js',
			//app+'/js/plugins/masonry.pkgd.min.js',
			app+'/js/plugins/select2.min.js',
			//app+'/js/plugins/jquery.elevateZoom.min.js',
			app+'/js/plugins/jquery.mmenu.all.js',
			app+'/js/plugins/smooth-scroll-link.min.js',
			app+'/js/plugins/parallax-mouse.js',
			//app+'/js/plugins/parallax.js',
			app+'/js/plugins/flickity.js'
		])
		.pipe( concat('scripts.min.js') )
		.pipe( uglify() )
		.pipe( gulp.dest(app+'/js/') ); //js default
	}
);

// STYLES
gulp.task('cssnano', ['sass'], () =>
	{
		return gulp.src(app+'/css/main.css')
		.pipe( cssnano({ reduceIdents :  false }) )
		.pipe(rename({suffix: '.min'}) )
		.pipe( gulp.dest(app+'/css/') ); //css default
	}
);

// RELOADER BROWSER
gulp.task('browser-sync', () =>
	{
		browserSync({
			server: {baseDir: app+''},
			//proxy: "http://",
			notify: false
		});
	}
);

// CLEAN DIR
gulp.task('clean', () =>
	{ return del.sync( 'dist/' ); }
);
// CLEAR
gulp.task('clear', () => 
	{
		return cache.clearAll();
	} 
)

// WATCHING
gulp.task('watch', ['browser-sync', 'scripts'], () =>
	{
		setTimeout(function() {
			gulp.watch(app+'/scss/**/*.+(scss|sass)', ['sass']);
		}, 800);
		gulp.watch(app+'/*.html', browserSync.reload);
		gulp.watch(app+'/**/*.php', browserSync.reload);
		gulp.watch(app+'/templates/**/*.tpl', browserSync.reload);
		gulp.watch(app+'/js/**/*.js', browserSync.reload);

	}
);



// PROD-BUILD
// this.array -> 'img' default
gulp.task('build', ['clean', 'cssnano', 'sass', 'scripts'], () =>

	{
		var css 	= gulp.src(app+'/css/main.min.css').pipe( gulp.dest( 'dist/css/' ) );
		var fonts 	= gulp.src(app+'/fonts/**/*').pipe( gulp.dest('dist/fonts/') );
		var js  	= gulp.src([app+'/js/scripts.min.js', app+'/js/main.js']).pipe( gulp.dest('dist/js/') );
		var html 	= gulp.src(app+'/*.+(html|php)').pipe( gulp.dest('dist/') );
	}

);