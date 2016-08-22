const gulp = require('gulp')
const babel = require('gulp-babel')
const sass = require('gulp-sass')
const browserSync = require('browser-sync')
const nodemon = require('gulp-nodemon')

gulp.task('default', ['browser-sync'], () => {
  gulp.watch('src/**/*.js', ['compileJs'])
  gulp.watch('src/style/*.scss', ['sass'])
  gulp.watch(['public/**/*.*', 'views/**/*.pug', 'src/style/*.scss']).on('change', browserSync.reload)
})

gulp.task('compileJs', () => {
  return gulp.src('src/**/*.js')
      .pipe(babel({
          presets: ['es2015']
      }))
      .pipe(gulp.dest('dist'))
})

gulp.task('browser-sync', ['compileJs', 'nodemon'], () => {
  browserSync.init({
    proxy: 'http://localhost:3000',
    port: 4000
  })
})

gulp.task('sass', function() {
  return gulp.src('src/style/style.scss')
        .pipe(sass())
        .pipe(gulp.dest('public/style'))
});

gulp.task('nodemon', (cb) => {
  
  var started = false;
  
  return nodemon({
    script: 'dist/app.js'
  }).on('start', () => {
    // to avoid nodemon being started multiple times
    if (!started) {
      cb()
      started = true
    } 
  });
});

