import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { FetchDataCSV } from '../helpers/FetchDataCSVSpreadSheet'
import { useAppContext } from '../context/AppContext'

import Header from '../components/Header'

function Loading () {
    const dummy = [
        {   
            id:1,
            "NAMA":"",
            "KELAS":""
        },
        {
            id:2,
            "NAMA":"",
            "KELAS":""
        },
        {
            id:3,
            "NAMA":"",
            "KELAS":""
        },
        {
            id:4,
            "NAMA":"",
            "KELAS":""
        },
        {
            id:5,
            "NAMA":"",
            "KELAS":""
        },
        {
            id:6,
            "NAMA":"",
            "KELAS":""
        },
    ]

    return dummy.map( (item) => {
        return (
            <div className='bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center flex flex-col items-center' key={item.id}>
                <h1 className='w-32 h-9 animate-pulse rounded-full bg-gray-700 mb-2'></h1>
                <p className='max-w-full min-w-40 h-5 animate-pulse rounded-full bg-gray-700 mb-2'></p>
                <button className='py-2 px-4 w-40 h-7 animate-pulse rounded-full bg-gray-700'></button>
            </div>   
        )
    })
}

function Home() {
    const [loading, setLoading] = useState(false)
    const { dataMaster, setDataMaster, setClasses, setSelectedSubject } = useAppContext()

    function handleClick (data) {
        setSelectedSubject({
            "MAPEL":data["MAPEL"],
            "KODE":data["KODE"]
        })
        setClasses({
            "7A":data["7A"],
            "7B":data["7B"],
            "8A":data["8A"],
            "8B":data["8B"],
            "9":data["9"]
        })
    }

    useEffect(() => {
        const URL_CSV_DATAMASTER = import.meta.env.VITE_DATAMASTER_CSV
        setLoading(true)
        FetchDataCSV(URL_CSV_DATAMASTER)
            .then((data) => {
                setDataMaster(data)
            })
            .catch((error) => {
                console.error("Error in fetching CSV:", error);
            })
            .finally(()=>setLoading(false))
    }, [])

  return (
    <div>
        <Header />
        <div className="max-w-[1200px] my-8 mx-auto p-4">
            <div className='grid grid-cols-2 gap-4'>
                { loading ? <Loading/> :
                    dataMaster.map((data,index) => (
                        <div key={index}   
                             className='bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center hover:transform hover:-translate-y-2 transition-transform'>
                            <h1 className='text-sm lg:text-xl font-semibold mb-2 cursor-default'>{data["MAPEL"]}</h1>
                            <p className='text-gray-600 mb-4 cursor-default'>Guru: {data["NAMA"]}</p>
                            <Link to={"/subject/"+data["KODE"]}
                                  onClick={()=>handleClick(data)}
                                  className='bg-[#0078d7] text-white py-2 px-4 rounded hover:bg-[#005bb5] transition-colors'>
                                    Select Subject
                            </Link>
                        </div>
                    ))
                }
            </div>
            
        </div>
    </div>
  )
}

export default Home