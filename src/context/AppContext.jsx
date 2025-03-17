import { createContext, useState, useContext } from "react";

const AppContext = createContext()

function AppProvider(props) {
    const [dataMaster, setDataMaster] = useState([])
    const [classes, setClasses] = useState({})
    const [selectedSubject, setSelectedSubject] = useState({
        "MAPEL":null,
        "KODE":null
    })
    const [selectedSubjectCode, setSelectedSubjectCode] = useState(null)
    const [selectedClass, setSelectedClass] = useState({
        "KELAS":null,
        "LINK":null
    })

    return (
        <AppContext.Provider value={{
            dataMaster,
            setDataMaster,
            classes,
            setClasses,
            selectedSubject,
            setSelectedSubject,
            selectedSubjectCode,
            setSelectedSubjectCode,
            selectedClass,
            setSelectedClass,
            }}
            {...props}
        />
    )
}

function useAppContext() {
    return useContext(AppContext)
}

export { AppProvider, useAppContext }