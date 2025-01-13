import React from 'react'
import { Link } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

import { ChevronLeftIcon } from '@heroicons/react/24/solid'


function Header() {
  const { selectedSubject, setSelectedSubject, selectedClass, setSelectedClass } = useAppContext()
  return (
    <header className='bg-[#0078d7] p-5 flex justify-center items-center'>
        {
          selectedSubject["MAPEL"] === null ?
          <></> :
          selectedClass["KELAS"] === null ? 
            <Link to="/"
                  onClick={()=>setSelectedSubject({
                    "MAPEL":null,
                    "KODE":null
                })}>
              <ChevronLeftIcon className='text-white size-6 lg:size-9 left-5 top-5 bottom-5 absolute'/>
            </Link>
          :
            <Link to={"/subject/"+selectedSubject["KODE"]}
                  onClick={()=>setSelectedClass({
                    "LINK":null,
                    "KELAS":null
                  })}>
              <ChevronLeftIcon className='text-white size-6 lg:size-9 left-5 top-5 bottom-5 absolute'/>
            </Link>
        }
      <h1 className='text-white lg:text-4xl font-bold text-xl cursor-default'>TUGAS {selectedSubject["MAPEL"] === null ? "SKPK" : selectedSubject["MAPEL"]} {selectedClass["KELAS"] === null ? "" : "- "+selectedClass["KELAS"]} </h1>  
    </header>
  )
}

export default Header