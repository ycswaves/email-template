import Gulp from 'Gulp'
import InlineCss from 'gulp-inline-css'
import Mustache from 'gulp-mustache'

const OUTPUT_PATH = __dirname + '/../output/'

export default function (templData, callback) {
  Gulp.task('inlineCss', ['mustache'], function() {

    return Gulp.src(OUTPUT_PATH+'*.html')
          .pipe(InlineCss({
            applyLinkTags: true,
            applyTableAttributes: true,
            removeLinkTags: true,
            removeHtmlSelectors: true
          }))
          .pipe(Gulp.dest(OUTPUT_PATH));
  });

  Gulp.task('mustache', function() {
    return Gulp.src(__dirname+'/../templates/*.mustache')
          .pipe(Mustache(templData, {extension: '.html'}))
          .pipe(Gulp.dest(OUTPUT_PATH));
  })

  Gulp.start('inlineCss', callback)
}