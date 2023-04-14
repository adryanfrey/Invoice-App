import { useState, useEffect } from "react"

import { auth } from "./firebase/config"
import { onAuthStateChanged } from "firebase/auth"

import { useNavigate } from "react-router-dom"


export default function Private({children}) {
    const [loading, setLoading] = useState(true)
    const [signed, setSigned] = useState(false)

    const navigate = useNavigate('')

    useEffect(() => {
        async function checkLogin() {
            onAuthStateChanged(auth, (user) => {
                
                if (user) {
                    const userData = {
                        uid: user.uid,
                        email: user.email
                    }

                    localStorage.setItem('@InvoiceAppUser', JSON.stringify(userData))
                    setLoading(false)
                    setSigned(true)
                } else {
                    setLoading(false)
                    setSigned(false)
                }
            })
        }

        checkLogin()
    },[])

    if (loading) {
        return (
            <p>
                Loading...
            </p>
        )
    }

    if (!signed) {
        navigate('/')
    }


    return children
}