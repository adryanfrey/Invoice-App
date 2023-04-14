import React from 'react'
import { Link } from 'react-router-dom'
import './styles.sass'

const DemoMessage = ({ close }) => {
    return (
        <>
            <div className="demoMessage-container">
                <h2>Create an account <br></br> to start using Invoice App :)</h2>
                <Link to='/register'>Register</Link>
                <button onClick={close} className='btn5'>Cancel</button>
            </div>
            <div className='filterDemoMessage'></div>
        </>
    )
}

export default DemoMessage