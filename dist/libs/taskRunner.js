'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (templData, callback) {
  _Gulp2.default.task('inlineCss', ['mustache'], function () {

    return _Gulp2.default.src(OUTPUT_PATH + '*.html').pipe((0, _gulpInlineCss2.default)({
      applyLinkTags: true,
      applyTableAttributes: true,
      removeLinkTags: true,
      removeHtmlSelectors: true
    })).pipe(_Gulp2.default.dest(OUTPUT_PATH));
  });

  _Gulp2.default.task('mustache', function () {
    return _Gulp2.default.src(__dirname + '/../templates/*.mustache').pipe((0, _gulpMustache2.default)(templData, { extension: '.html' })).pipe(_Gulp2.default.dest(OUTPUT_PATH));
  });

  _Gulp2.default.start('inlineCss', callback);
};

var _Gulp = require('Gulp');

var _Gulp2 = _interopRequireDefault(_Gulp);

var _gulpInlineCss = require('gulp-inline-css');

var _gulpInlineCss2 = _interopRequireDefault(_gulpInlineCss);

var _gulpMustache = require('gulp-mustache');

var _gulpMustache2 = _interopRequireDefault(_gulpMustache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OUTPUT_PATH = __dirname + '/../output/';