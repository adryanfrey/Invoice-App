// sass
import './login.sass'

// hooks
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// firebase
import {auth} from '../../firebase/config'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'

// gsap
import gsap from 'gsap'

const Login = () => {
  // states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // navigation
  const navigate = useNavigate('')

  // signOut if user is signed
  useEffect(() => {
    signOut(auth)
  },[])

  // animation when first render 
  useEffect(() => {
    
    const loginContainer = document.querySelector('.login-container')
    const gsapStagger = document.querySelectorAll('.gsapStagger')
    
    const tl = gsap.timeline({defaults: {duration: 1}})

    tl.to(loginContainer, {scale: 1,ease: "back.out(2)"})
    gsap.fromTo(gsapStagger, {y: -50}, {y: 0, opacity: 1, stagger: 0.1})

    // button hover effect
    const loginBtn = document.querySelector('#loginBtn')

    loginBtn.addEventListener('mouseover',() => {
      gsap.to(loginBtn, {backgroundColor: '#7e88c3', duration: .4, color: '#fff'})
    })

    loginBtn.addEventListener('mouseout',() => {
      gsap.to(loginBtn, {backgroundColor: '#f8f8fb', duration: .4, color: '#7e88c3'})
    })

  },[])

  // login
  const handleSubmit = async (e) => {
    e.preventDefault()

    await signInWithEmailAndPassword(auth, email, password)
    .then((value) => {
      navigate('/invoices')
    })
    .catch((error) => {
      console.log(error.message)
      if (error.message.includes('user-not')) {
        setError('User nout found')
      } else if (error.message.includes('wrong-password')) {
        setError('Wrong password')
      } else {
        setError('Sorry there was an error try again later')
      }
    })
  }

  // login with demo account
  const handleDemo = async () => {
    await signInWithEmailAndPassword(auth, 'demo@version.com', 'demo123')
    .then((value) => {
      navigate('/invoices')
    })
    .catch((error) => {
      console.log(error.message)
      if (error.message.includes('user-not')) {
        setError('User nout found')
      } if (error.message.includes('wrong-password')) {
        setError('Wrong password')
      }
    })
  }

  return (
    <div className='login'>
      <div className='login-container'>
        <h1 className='gsapStagger'>Invoice App</h1>
        <h3 className='gsapStagger'>Manage your invoices easily</h3>
        <form onSubmit={(e) => handleSubmit(e)}>
          <label className='gsapStagger'>
            Email:
            <input type="email" required placeholder='Your email' value={email} onChange={(e) => setEmail(e.target.value)}/>
          </label>
          <label className='gsapStagger'>
            Password:
            <input type="password" required placeholder='Your password' value={password} onChange={(e) => setPassword(e.target.value)}/>
          </label>
          {error &&
          <p className='error'>{error}</p>
          }
          <button id='loginBtn' className='gsapStagger'>Login</button>
        </form>
        <p className='gsapStagger'>Dont have an account? <Link to='/register'>Register</Link></p>
        <p className='gsapStagger'>Try Demo Account: <span onClick={handleDemo}>Demo</span></p>
      </div>
    </div>
  )
}

export default Login