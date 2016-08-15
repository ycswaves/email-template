import Express from 'express'
import Multer from 'multer'
import XLSX from 'xlsx'
import RunTask from './libs/taskRunner'

//import { Converter } from 'csvtojson'

const app = Express()

const uploadHandler = Multer({storage: Multer.memoryStorage()})

const OUTPUT_PATH = __dirname + '/../output/'
const port = process.env.PORT || 3000

app.set('views', __dirname+'/../views').set('view engine', 'pug');

app.listen(port, () => {
  console.log('server started')
})

app.get('/', (req, res) => {
  res.send('hello template')
})
.get('/upload', (req, res) => {
  res.render('uploadPage', {title: "I love files!"})
})
.post('/submit-csv', uploadHandler.single('myFile'), (req, res) => {
  const data = new Uint8Array(req.file.buffer);
  let arr = new Array();
  for(let i = 0; i != data.length; ++i) {
    arr.push(String.fromCharCode(data[i]))
  };
  const bstr = arr.join("");
  const workbook = XLSX.read(bstr, {type: 'binary'})


  const sheetNamelist = workbook.SheetNames
  let result = {}
  sheetNamelist.forEach((name) => {
    result[name] = XLSX.utils.sheet_to_json(workbook.Sheets[name])
  })

  const templData = Object.assign(result.Others[0], {
    projects: result.Projects
  })

  RunTask(templData, () => {

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
  //res.send(result)
})



