// sass
import './navbar.sass'

// assets
import logo from '../../assets/logo.png'

// hooks
import { useNavigate } from 'react-router-dom'

// firebase 
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase/config'

const Navbar = ({handleMode, darkMode}) => {
  const navigate = useNavigate('/')

  const handleSignOut = () => {
    signOut(auth)
  }

  return (
    <div className='navbar'>
      <img src={logo} alt="App Logo" onClick={() => navigate('/invoices')}/>
      <div id='modeContainer' className='icon-container'>
        <i id='icon' onClick={handleMode} className={darkMode ? "fa-solid fa-sun" : "fa-solid fa-moon"}></i>
      </div>
      <div className='icon-container'>
        <i onClick={handleSignOut} id='signOut' className="fa-solid fa-arrow-right-from-bracket"></i>
      </div>
    </div>
  )
}

export default Navbar