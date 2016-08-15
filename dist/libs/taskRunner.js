'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (templData, callback) {
  _gulp2.default.task('inlineCss', ['mustache'], function () {

    return _gulp2.default.src(OUTPUT_PATH + '*.html').pipe((0, _gulpInlineCss2.default)({
      applyLinkTags: true,
      applyTableAttributes: true,
      removeLinkTags: true,
      removeHtmlSelectors: true
    })).pipe(_gulp2.default.dest(OUTPUT_PATH));
  });

  _gulp2.default.task('mustache', function () {
    return _gulp2.default.src(__dirname + '/../templates/*.mustache').pipe((0, _gulpMustache2.default)(templData, { extension: '.html' })).pipe(_gulp2.default.dest(OUTPUT_PATH));
  });

  _gulp2.default.start('inlineCss', callback);
};

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _gulpInlineCss = require('gulp-inline-css');

var _gulpInlineCss2 = _interopRequireDefault(_gulpInlineCss);

var _gulpMustache = require('gulp-mustache');

var _gulpMustache2 = _interopRequireDefault(_gulpMustache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OUTPUT_PATH = __dirname + '/../output/';