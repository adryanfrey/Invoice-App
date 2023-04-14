// sass
import './register.sass'

// hooks
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// react toastify
import { toast } from 'react-toastify'

// firebase
import { auth } from '../../firebase/config'
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth'

// gsap
import gsap from 'gsap'

const Register = () => {
    // states
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')

    // navigation
    const navigate = useNavigate('')

    // signOut if user is signed
    useEffect(() => {
        signOut(auth)
    }, [])

    // animation when first render 
    useEffect(() => {

        const registerContainer = document.querySelector('.register-container')
        const gsapStagger = document.querySelectorAll('.gsapStagger')

        const tl = gsap.timeline({ defaults: { duration: 1 } })

        tl.to(registerContainer, { scale: 1, ease: "back.out(2)" })
        gsap.fromTo(gsapStagger, { y: -50 }, { y: 0, opacity: 1, stagger: 0.1 })

        // button hover effect
        const registerBtn = document.querySelector('#registerBtn')

        registerBtn.addEventListener('mouseover', () => {
            gsap.to(registerBtn, { backgroundColor: '#7e88c3', duration: .4, color: '#fff' })
        })

        registerBtn.addEventListener('mouseout', () => {
            gsap.to(registerBtn, { backgroundColor: '#f8f8fb', duration: .4, color: '#7e88c3' })
        })

    }, [])

    // register
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setError('Passwords must be the same')
        }

        await createUserWithEmailAndPassword(auth, email, password)
            .then((value) => {
                toast.success('Account created successfully')
                navigate('/')
            })
            .catch((error) => {
                console.log(error.message)
                if (error.message.includes('weak-password')) {
                    setError('Password should be at least 6 characters')
                } else if (error.message.includes('email-already')) {
                    setError('Email already registered')
                } else if (error.message.includes('invalid-email')) {
                    setError('Invalid Email')
                } else {
                    toast.warn('There was an error, try again later')
                }
            })

    }

    return (
        <div className='register'>
            <div className='register-container'>
                <h1 className='gsapStagger'>Invoice App</h1>
                <h3 className='gsapStagger'>Manage your invoices easily</h3>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <label className='gsapStagger'>
                        Email:
                        <input type="email" required placeholder='Your email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    </label>
                    <label className='gsapStagger'>
                        Password:
                        <input type="password" required placeholder='Your password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    </label>
                    <label className='gsapStagger'>
                        Confirm Password:
                        <input type="password" required placeholder='Your password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        {error &&
                            <p className='error'>{error}</p>
                        }
                    </label>
                    <button id='registerBtn' className='gsapStagger'>Register</button>
                </form>
                <p className='gsapStagger'>Already have an account? <Link to='/'>Login</Link></p>
            </div>
        </div>
    )
}

export default Register