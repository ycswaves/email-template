'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _taskRunner = require('./libs/taskRunner');

var _taskRunner2 = _interopRequireDefault(_taskRunner);

var _xlsxConverter = require('./libs/xlsxConverter');

var _xlsxConverter2 = _interopRequireDefault(_xlsxConverter);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var uploadHandler = (0, _multer2.default)({ storage: _multer2.default.memoryStorage() });
var OUTPUT_PATH = __dirname + '/../output/';
var port = process.env.PORT || 3000;

app.set('views', __dirname + '/../views').set('view engine', 'pug');
app.use(_express2.default.static('public'));

app.listen(port, function () {
  console.log('server started, port:' + port);
});

app.get('/', function (req, res) {
  res.render('uploadPage', { title: "Staffing Template" });
});

app.get('/preview', function (req, res) {
  _fs2.default.readFile(OUTPUT_PATH + 'staffingUpdate.html', function (err, contents) {
    contents = contents.toString();
    res.render('preview', { rawHtml: contents.substring(contents.indexOf('<body>'), contents.indexOf('</body>') + 7) });
  });
});

app.get('/iframe', function (req, res) {
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

app.post('/submit', uploadHandler.single('excel-file'), function (req, res) {
  var templData = (0, _xlsxConverter2.default)(req.file.buffer);

  (0, _taskRunner2.default)(templData, function () {
    res.json({ redirect: '/preview' });
  });
});