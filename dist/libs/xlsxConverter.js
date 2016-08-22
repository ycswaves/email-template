'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (buffer) {
  var data = new Uint8Array(buffer);
  var arr = new Array();
  for (var i = 0; i != data.length; ++i) {
    arr.push(String.fromCharCode(data[i]));
  };
  var bstr = arr.join("");
  var workbook = _xlsx2.default.read(bstr, { type: 'binary' });

  var sheetNamelist = workbook.SheetNames;
  var result = {};
  sheetNamelist.forEach(function (name) {
    result[name] = _xlsx2.default.utils.sheet_to_json(workbook.Sheets[name]);
  });

  var templData = Object.assign(result.Others[0], {
    projects: result.Projects
  });

  return templData;
};

var _xlsx = require('xlsx');

var _xlsx2 = _interopRequireDefault(_xlsx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }