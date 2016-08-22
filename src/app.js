import Express from 'express'
import Multer from 'multer'
import RunTask from './libs/taskRunner'
import XlsxConvert from './libs/xlsxConverter'
import fs from 'fs'


const app = Express()
const uploadHandler = Multer({storage: Multer.memoryStorage()})
const OUTPUT_PATH = __dirname + '/../output/'
const port = process.env.PORT || 3000

app.set('views', __dirname+'/../views').set('view engine', 'pug');
app.use(Express.static('public'));


app.listen(port, () => {
  console.log('server started, port:'+port)
})

app.get('/', (req, res) => {
  res.render('uploadPage', {title: "Staffing Template"})
})

app.get('/preview', (req, res) => {
  fs.readFile(OUTPUT_PATH + 'staffingUpdate.html', (err, contents) => {
    contents = contents.toString()
    res.render('preview', {rawHtml: contents.substring(contents.indexOf('<body>'), contents.indexOf('</body>')+7)})
  });
})

app.get('/iframe', (req, res) => {
    const options = {
      root: OUTPUT_PATH,
      dotfiles: 'deny',
      headers: {
          'x-timestamp': Date.now(),
          'x-sent': true
      }
    };

    res.sendFile('staffingUpdate.html', options, (err) => {
      if (err) {
        console.log(err);
        res.status(err.status).end();
      }
    });
})

app.post('/submit', uploadHandler.single('excel-file'), (req, res) => {
  const templData = XlsxConvert(req.file.buffer)

  RunTask(templData, () => {
    res.json({redirect: '/preview'})
  })
})



