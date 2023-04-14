// hooks
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { useState, useEffect } from 'react';

// firebase
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';

// react toastify
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
 
// components
import Navbar from './components/sidebar/Sidebar';
import Private from './Private';

// sass
import './sass/global.sass'

// pages
import Login from './pages/login/Login'
import Register from './pages/register/Register';
import Invoices from './pages/invoices/Invoices';
import InvoiceDetail from './pages/invoiceDetail/InvoiceDetail';

function App() {
  const [checkAuth, setCheckAuth] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

// check authentication
  useEffect(() => {
    async function checkLogin() {
        onAuthStateChanged(auth, (user) => {
            if (user) {
              setCheckAuth(true)
            } else {
              setCheckAuth(false)
            }
        })
    }
    checkLogin()
},[])

// change mode
const handleMode = () => {
  if(darkMode) {
    setDarkMode(false)
  } else {
    setDarkMode(true)
  }
}

  return (
    <div className="app">
      <BrowserRouter>
        <ToastContainer autoClose={2000} position='top-center'/>
        {checkAuth && 
          <Navbar handleMode={handleMode} darkMode={darkMode} />
        }
        <Routes> 
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/invoices' element={<Private> <Invoices darkMode={darkMode} /> </Private>} />
          <Route path='/invoiceDetail/:id' element={<Private> <InvoiceDetail darkMode={darkMode} /> </Private>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
