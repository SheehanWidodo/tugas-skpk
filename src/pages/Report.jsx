import React from 'react'
import { useState, useEffect } from 'react'
import { FetchDataCSV } from '../helpers/FetchDataCSVSpreadSheet'
import { useAppContext } from '../context/AppContext'

import Header from '../components/Header'
import { XMarkIcon } from '@heroicons/react/24/solid'

function Report() {
  const [data, setData] = useState([])
  const [table, setTable] = useState([])
  const [header, setHeader] = useState([])
  const [header_exp, setHeader_exp] = useState([])
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [popupContent, setPopupContent] = useState({
    'title':"",
    'content':""
  })
  const { selectedClass } = useAppContext()

  useEffect(() => {
    setLoading(true)    
    FetchDataCSV(selectedClass["LINK"])
        .then((data) => {
            setData(data)
            setTable(data)
            setHeader(Object.keys(data[0]))
            setHeader_exp(data[0])
        })
        .catch((error) => {
            console.error("Error in fetching CSV:", error);
        })
        .finally(()=>setLoading(false))
  }, [])

  function FormHandler(event) {
    const temp = []
    event.preventDefault()
    setInputValue('')
    data.map((baris)=>{
      if (baris["NAMA SISWA"].indexOf(inputValue) >= 0) {
        temp.push(baris)
      }
    })
    setTable(temp)
  }

  function openPopUp(title, content) {
    setPopupContent({
        'title':title,
        'content':content
    })
    setIsOpen(true)
  }

  function closePopUp() {
    setIsOpen(false)
  }

  return (
    <>
        <Header />
        <div className="my-5 mx-auto max-w-[1000px] p-5 bg-white rounded-lg shadow-md">

            {/* Search Bar */}
            <form className='mb-5 flex gap-6 text-sm'
                onSubmit={FormHandler}>
                <input type="text" 
                        placeholder="Search by student name..." 
                        className='w-full p-3 border border-solid border-black rounded'
                        value={inputValue}
                        onChange={ (e) => { setInputValue(e.currentTarget.value) } }/>
                <button type='submit'
                        className='py-3 px-5 text-white bg-[#0078d7] rounded-md cursor-pointer hover:bg-[#005bb5]'>
                        Search
                </button>
            </form>

            {loading && <p className='text-center text-lg'>Loading...</p>}

            <div className='mt-5 overflow-auto max-h-96 border border-gray-300 relative'>

                {/* Table Large Screen */}
                <table className='border-separate border-spacing-0 border border-gray-300 min-w-full text-left table-fixed cursor-default hidden lg:block'>
                    <thead className='w-full'>
                        <tr className='w-full'>
                        {header.map((column,index)=>(
                            index === 0 ? null :
                            <th key={index}
                                title={header_exp[column]}
                                onClick={()=>openPopUp(column, header_exp[column])}
                                className={['px-4 py-2 sticky top-0 bg-gray-100 cursor-pointer',index === 1 ? 'w-28 z-30 left-0 border-r-2' : 'w-4 text-center'].join(" ")}>
                                {column}                        
                            </th>
                        ))}
                        </tr>
                    </thead>
                    <tbody>
                    {
                        table.map((baris,index_baris)=> {
                        if (baris["NAMA SISWA"] == "" || baris["NAMA SISWA"] == "JUMLAH") {
                            return null
                        }
                        return (
                            <tr key={index_baris} className={index_baris%2 === 0 ? "bg-gray-50" : ""}>
                            { 
                                header.map((column,index)=>(
                                <td key={index}
                                    className={['px-4 py-2',index === 0 ?'w-28 sticky left-0 z-20 truncate overflow-hidden whitespace-nowrap border-r-2' : 'w-4 text-center',index_baris%2 === 0 ? "bg-gray-50" : "bg-white"].join(" ")}
                                    title={baris[column]}>
                                        { column === "NAMA SISWA" ? baris[column] : baris[column] > 75 ? "✅" : baris[column] == "" ? "-" : "❌"}               
                                </td>
                                ))
                            }
                            </tr>
                        )
                        })
                    }
                    </tbody>
                </table>

                {/* Table Small Screen*/}
                <table className='border-separate border-spacing-0 border border-gray-300 min-w-full text-left table-fixed cursor-default lg:hidden'>
                    <thead className='w-full'>
                        <tr className='w-full'>
                        {header.map((column,index)=>(
                            index === 0 ? null :
                            <th key={index}
                                title={header_exp[column]}
                                onClick={()=>openPopUp(column, header_exp[column])}
                                className={['px-4 py-2 sticky top-0 bg-gray-100 cursor-pointer',index === 1 ? 'max-w-36 z-30 left-0 border-r-2' : 'w-4 text-center'].join(" ")}>
                                {column}                        
                            </th>
                        ))}
                        </tr>
                    </thead>
                    <tbody>
                    {
                        table.map((baris,index_baris)=> {
                        if (baris["NAMA SISWA"] == "" || baris["NAMA SISWA"] == "JUMLAH") {
                            return null
                        }
                        return (
                            <tr key={index_baris} className={index_baris%2 === 0 ? "bg-gray-50" : ""}>
                            { 
                                header.map((column,index)=>(
                                    index === 0 ? null :
                                    <td key={index}
                                        className={['px-4 py-2',index === 1 ?'max-w-36 sticky left-0 z-20 truncate overflow-hidden whitespace-nowrap border-r-2' : 'w-4 text-center',index_baris%2 === 0 ? "bg-gray-50" : "bg-white"].join(" ")}
                                        title={baris[column]}>
                                            { column === "NAMA SISWA" || column === "NO" ? baris[column] : baris[column] > 75 ? "✅" : baris[column] == "" ? "-" : "❌"}               
                                    </td>
                                ))
                            }
                            </tr>
                        )
                        })
                    }
                    </tbody>
                </table>

                {/* Pop Up */}
                {isOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded shadow-lg max-w-fit min-w-20">
                            <div className='flex justify-end bg-[#0078d7] p-2'>
                            <button
                                onClick={closePopUp}
                                className="size-6 lg:size-9 rounded hover:bg-red-600 focus:outline-none"
                            >
                                <XMarkIcon />
                            </button>
                            </div>
                            <h2 className="text-lg font-bold my-2 px-2">{popupContent.title}</h2>
                            <p className="text-gray-600 mb-4 px-2">{popupContent.content==""?"-":popupContent.content}</p>
                            
                        </div>
                    </div>
                )}
            </div>
        </div>
    </>
  )
}

export default Report