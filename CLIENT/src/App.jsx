import React from 'react'
import LandingPage from './Pages/LandingPage'
import { Routes, Route } from 'react-router-dom'
import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'
import Dashboard from './Pages/Dashboard'
import UploadMaterials from './Pages/UploadMaterials'
import Notice from './Pages/Notice'
import Profile from './Pages/Profile'
import ViewMaterial from './Pages/ViewMaterial'

const App = () => {
  return (
    <>
        
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/uploadMaterial' element={<UploadMaterials/>} />
          <Route path='/notification' element={<Notice/>} />
          <Route path='/profile' element={<Profile/>} />
          <Route path='/viewMaterial' element={<ViewMaterial/>} />
        </Routes>
    </>
  )
}

export default App