import React from 'react'
import { AppProvider } from './context/AppContext'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Report from './pages/Report'
import NotFound from './pages/NotFound'
import Menu from './pages/Menu'

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route exact path='/' element={<Report />} />
          {/* <Route path='/subject/:sub' element={<Menu />} />
          <Route path='/subject/:sub/report/:id' element={<Report />} /> */}
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Router>
    </AppProvider>
  )
}

export default App
