'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _xlsx = require('xlsx');

var _xlsx2 = _interopRequireDefault(_xlsx);

var _taskRunner = require('./libs/taskRunner');

var _taskRunner2 = _interopRequireDefault(_taskRunner);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import { Converter } from 'csvtojson'

var app = (0, _express2.default)();

var uploadHandler = (0, _multer2.default)({ storage: _multer2.default.memoryStorage() });

var OUTPUT_PATH = __dirname + '/../output/';
var port = process.env.PORT || 3000;

app.set('views', __dirname + '/../views').set('view engine', 'pug');

app.listen(port, function () {
  console.log('server started');
});

app.get('/', function (req, res) {
  res.send('hello template');
}).get('/upload', function (req, res) {
  res.render('uploadPage', { title: "I love files!" });
}).post('/submit-csv', uploadHandler.single('myFile'), function (req, res) {
  var data = new Uint8Array(req.file.buffer);
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

  (0, _taskRunner2.default)(templData, function () {

    var options = {
      root: OUTPUT_PATH,
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    };

    res.sendFile('staffingUpdate.html', options, function (err) {
      if (err) {
        console.log(err);
        res.status(err.status).end();
      }
    });
  });
  //res.send(result)
});