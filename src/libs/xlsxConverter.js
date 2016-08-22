import XLSX from 'xlsx'

export default function (buffer) {
  const data = new Uint8Array(buffer);
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

  return templData
}