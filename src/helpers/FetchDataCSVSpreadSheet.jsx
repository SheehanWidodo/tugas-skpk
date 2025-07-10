import axios from "axios"

function ParseCSV(dataCSV) {
    const rows = dataCSV.split(/\r?\n/)
    const headers = rows[0].split(',')
    const data = []
    for (let i = 1; i < rows.length; i++) {
      const rowData = rows[i].split(',')
      const rowObject = {}
      for (let j = 0; j < headers.length; j++) {
        rowObject[ headers[j] ] = rowData[j]
      }
      data.push(rowObject)
    }
    return data
  }

  export async function FetchDataCSV(URL_CSV) {
    return axios.get(URL_CSV)
         .then((response) => {
            return ParseCSV(response.data)
         })
         .catch((error) => {
            console.error('Error fetching data: ', error)
            throw error
         })
  }

  function ParseCSVMapel(dataCSV) {
    const rows = dataCSV.split(/\r?\n/)
    const headers = rows[4].split(',')
    const data = []
    for (let i = 5; i < rows.length; i++) {
      const rowData = rows[i].split(',')
      const rowObject = {}
      for (let j = 0; j < headers.length; j++) {
        rowObject[ headers[j] ] = rowData[j]
      }
      data.push(rowObject)
    }
    return data
  }

  export async function FetchDataCSVMapel(URL_CSV) {
    return axios.get(URL_CSV)
         .then((response) => {
            return ParseCSVMapel(response.data)
         })
         .catch((error) => {
            console.error('Error fetching data: ', error)
            throw error
         })
  }