import React from "react";
import { useState, useEffect } from "react";
import Papa from "papaparse";

import { XMarkIcon } from "@heroicons/react/24/solid";

function Report() {
  const [data, setData] = useState([]);
  const [table, setTable] = useState([]);
  const [dataMaster, setDataMaster] = useState([])
  const [dataMapel, setDataMapel] = useState([])
  const [mapel, setMapel] = useState("")
  const [dataKelas, setDataKelas] = useState([])
  const [kelas, setKelas] = useState("")
  const [header, setHeader] = useState([]);
  const [header_exp, setHeader_exp] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [popupContent, setPopupContent] = useState({
    title: "",
    content: "",
  });
    
  
  useEffect(()=> {
    const URL_CSV_DATAMASTER = import.meta.env.VITE_DATAMASTER_CSV
    fetch(URL_CSV_DATAMASTER)
      .then((res) => res.text())
      .then((text) => {
        Papa.parse(text, {
          header: false,
          skipEmptyLines: true,
          complete: ({data}) => {
            const mapelList = []
            for (let index = 1; index < data.length; index++) {
              mapelList.push(data[index][1]);
            }
            setDataMapel(mapelList)

            const kelasList = []
            for (let index = 3; index < data[0].length; index++) {
              kelasList.push(data[0][index]);
            }
            setDataKelas(kelasList)

            setDataMaster(data)
          }
        }) 
      })
  }, [])
  
  function doFetchData () {
    if (!dataMaster?.length) {
      return;
    }
    if (!dataMaster[Number(mapel)+1] || !dataMaster[Number(mapel)+1][Number(kelas)+3]) {
      return;
    }
    if (mapel === "" || kelas === "") {
      alert("🚨 Pilih Mapel & Kelas dulu yaa!");
      return;
    }
    
    setInputValue("")
    setLoading(true);
    fetch(dataMaster[Number(mapel)+1][Number(kelas)+3]) 
      .then((res) => res.text())
      .then((text) => {
        Papa.parse(text, {
          header: false,
          skipEmptyLines: true,
          complete: ({ data }) => {
            const dataSiswa = []
            const headers = data[3];//ambil nama kolom

            const skipIndexes = [21, 26, 29, 30];//skip kolom rata2
            setHeader_exp(data[2]
                          .slice(5)
                          .filter((exp, idx)=>{
                            const realIdx = idx+5
                            return !skipIndexes.includes(realIdx)
                          }))

            const rows = data.slice(4);//data siswa dimulai dari baris ke 5
            for (let index = 0; index < rows.length; index++) {//memperbarui data agar yang ada nilainya saja yang dicatat
              const row = rows[index];
              if (row[1] == "" || row[2] == "") { //kalau NISN siswa kosong atau nama siswa kosong, di skip
                break;
              }
              const obj = {};
              headers.forEach((h, i) => {
                if ( //skip kolom
                  h == "" ||
                  h == "L/P" ||
                  h == "(F)" ||
                  h == "(S)" ||
                  h == "(AS)" ||
                  h == "(Rapor)"
                ) {
                  return;
                } else {
                  obj[h] = row[i];
                }
              });
              dataSiswa.push(obj)
            }
            setData(dataSiswa)
            setTable(dataSiswa)
            setHeader(Object.keys(dataSiswa[0]));
          },
        });
      })
      .catch((error) => {
        console.error("Error in fetching CSV:", error);
      })
      .finally(() => setLoading(false));
  }

  function FormHandler(event) {
    if (mapel === "" || kelas === "" || data == []) {
      alert("🚨 Pilih Mapel & Kelas dulu yaa!");
      return;
    }
    const temp = [];
    event.preventDefault();
    data.map((baris) => {
      if (baris["NAMA"].indexOf(inputValue) >= 0) {
        temp.push(baris);
      } 
    });
    setTable(temp);
  }

  function openPopUp(title, content) {
    setPopupContent({
      title: title,
      content: content,
    });
    setIsOpen(true);
  }

  function closePopUp() {
    setIsOpen(false);
  }

  return (
    <>
      {/* Header */}
      <header className='bg-[#0078d7] p-5 flex justify-center items-center'>
        <h1 className='text-white lg:text-4xl font-bold text-xl cursor-default'>
          TUGAS SKPK
        </h1>
      </header>

      {/* Dropdown Card */}
      <div className="my-5 mx-auto max-w-[1000px] p-5 bg-white rounded-lg shadow-md flex flex-col text-sm">
        {/* Dropdown Section */}
        <div className="flex flex-row gap-4 lg:gap-24 justify-between">
          <div className="flex flex-col w-full">
            <select
              value={mapel}
              onChange={(e) => setMapel(e.target.value)}
              className="p-2 border w-full rounded truncate text-ellipsis overflow-hidden whitespace-nowrap"
            >
              <option value="" disabled>--Select Subject--</option>
              { dataMapel.length === 0 ? <option value="" disabled className="text-xs text-blue-800">Loading...</option>:
              dataMapel.map((m, idx) => (
                <option key={idx} value={idx}>{m}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-full">
            <select
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
              className="p-2 border w-full rounded"
            >
              <option value="" disabled>--Select Class--</option>
              { dataKelas.length === 0 ? <option value="" disabled className="text-xs text-blue-800">Loading...</option>:
              dataKelas.map((k, idx) => (
                <option key={idx} value={idx}>{k}</option>
              ))}
            </select>
          </div>

          <button
            className="py-2 px-3 w-full text-white bg-[#0078d7] rounded-md cursor-pointer hover:bg-[#005bb5]"
            onClick={() => doFetchData()}
          >
              Load Data
          </button>
        </div>
      </div>


      {/* Table Card */}
      <div className="my-5 mx-auto max-w-[1000px] p-5 bg-white rounded-lg shadow-md">
        {/* Search Bar */}
        <form className="mb-5 flex gap-6 text-sm" onSubmit={FormHandler}>
          <span className="w-full p-3 border border-solid border-black rounded flex justify-between items-center">
            <input
            type="text"
            placeholder="Search by student name..."
            className="w-full outline-none"
            disabled={mapel === "" || kelas === "" || data == []}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.currentTarget.value);
            }}
          />
          <button 
            className={["size-4 rounded-full hover:bg-[#0078d7] hover:text-white",inputValue?"":"hidden"].join(" ")}
            onClick={()=>setInputValue("")}>
            <XMarkIcon />
          </button>
          </span>
          <button
            type="submit"
            className="py-3 px-5 text-white bg-[#0078d7] rounded-md cursor-pointer hover:bg-[#005bb5]"
          >
            Search
          </button>
        </form>

        {loading && <p className="text-center text-lg">Loading...</p>}

        <div className="mt-5 overflow-auto max-h-72 border border-gray-300 relative">
          {/* Table Large Screen */}
          <table className="w-full lg:min-w-[2000px] text-left table-fixed cursor-default text-[10px] lg:text-sm">
            <thead className="w-full">
              <tr className="w-full">
                {header.map((column, index) => (
                  <th
                    key={index}
                    title={index !== 0 ? header_exp[index-1] : undefined}
                    onClick={index !== 0 ? () => openPopUp(column, header_exp[index-1]):undefined}
                    className={[
                      "px-4 py-2 sticky top-0 bg-gray-100 border-b-2 border-gray-300",
                      index === 0
                        ? "w-28 lg:w-72 z-30 left-0 before:content-[''] before:absolute before:top-0 before:right-0 before:w-[2px] before:h-full before:bg-gray-300 after:content-[''] after:absolute after:top-0 after:right-0 after:w-[2px] after:h-full after:bg-gray-300"
                        : "w-16 lg:w-20 text-center cursor-pointer",
                    ].join(" ")}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.map((baris, index_baris) => {
                return (
                  <tr
                    key={index_baris}
                    className={index_baris % 2 === 0 ? "bg-gray-50" : ""}
                  >
                    {header.map((column, index) => (
                      <td
                        key={index}
                        className={[
                          "px-4 py-2",
                          index === 0
                            ? "w-28 truncate overflow-hidden lg:w-72 sticky left-0 z-20 whitespace-nowrap before:content-[''] before:absolute before:top-0 before:right-0 before:w-[2px] before:h-full before:bg-gray-300 after:content-[''] after:absolute after:top-0 after:right-0 after:w-[2px] after:h-full after:bg-gray-300"
                            : "w-16 lg:w-20 text-center",
                          index_baris % 2 === 0 ? "bg-gray-50" : "bg-white",
                        ].join(" ")}
                      >
                        {column === "NAMA"
                          ? baris[column]
                          : baris[column] >= 75
                          ? "✅"
                          : baris[column] == ""
                          ? "-"
                          : "❌"}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>       

          {/* Pop Up */}
          {isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded shadow-lg max-w-fit min-w-20">
                <div className="flex justify-end bg-[#0078d7] p-2">
                  <button
                    onClick={closePopUp}
                    className="size-6 lg:size-9 rounded hover:bg-red-600 focus:outline-none"
                  >
                    <XMarkIcon />
                  </button>
                </div>
                <h2 className="text-lg font-bold my-2 px-2">
                  {popupContent.title}
                </h2>
                <p className="text-gray-600 mb-4 px-2">
                  {popupContent.content == "" ? "-" : popupContent.content}
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default Report;
