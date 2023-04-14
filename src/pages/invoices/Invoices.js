// sass
import './invoices.sass'

// hooks
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

// assets
import emptyList from '../../assets/emptyList.png'

// gsap
import { gsap } from 'gsap'

// firebase
import { db } from '../../firebase/config'
import { onSnapshot, query, orderBy, collection, where } from 'firebase/firestore'

// components
import Formular from '../../components/formular/Formular'
import DemoMessage from '../../components/demoMessage/DemoMessage'


const Invoices = ({ darkMode }) => {
  // states
  const [invoices, setInvoices] = useState([])
  const [filteredInvoices, setFilteredInvoices] = useState([])
  const [displayForm, setDisplayForm] = useState(false)
  const [user, setUser] = useState({})
  const navigate = useNavigate('')
  const [displayFilterStatus, setDisplayFilterStatus] = useState(false)
  const [notFound, setNotFound] = useState('')
  const [windowSize, setWindowSize] = useState(window.innerWidth)
  const [demoMessage, setDemoMessage] = useState(false)

  // load invoices
  useEffect(() => {

    async function loadInvoices() {
      const userData = localStorage.getItem('@InvoiceAppUser')
      setUser(JSON.parse(userData))

      const user = JSON.parse(userData)

      const taskRef = collection(db, "invoices")
      const q = query(taskRef, orderBy('created', 'desc'), where('uid', '==', user.uid))

      onSnapshot(q, (snapshot) => {
        let list = []

        snapshot.forEach((doc) => {
          list.push({
            uid: doc.data().uid,
            due: doc.data().due,
            invoiceID: doc.data().invoiceID,
            fromAddress: doc.data().fromAddress,
            fromCity: doc.data().fromCity,
            fromPostCode: doc.data().fromPostCode,
            fromCountry: doc.data().fromCountry,
            clientName: doc.data().clientName,
            clientEmail: doc.data().clientEmail,
            toAddress: doc.data().toAddress,
            toCity: doc.data().toCity,
            toPostCode: doc.data().toPostCode,
            toCountry: doc.data().toCountry,
            date: doc.data().date,
            paymentTerms: doc.data().paymentTerms,
            description: doc.data().description,
            total: doc.data().total,
            status: doc.data().status,
          })
          setInvoices(list)
          setFilteredInvoices(list)
        })
      })
    }
    loadInvoices()
  }, [])

  // filter invoices by status
  const handleStatusFilter = (status) => {
    if (status === 'All') {
      setFilteredInvoices(invoices)
    } else {
      setFilteredInvoices(invoices.filter((invoice) => invoice.status === status))
    }
  }

  //animation filter status 
  useEffect(() => {
    const optionsContainer = document.querySelector('.status-options-container')

    if (displayFilterStatus) {
      gsap.to(optionsContainer, { scale: 1, y: 0, duration: 1, transformOrigin: 'top', opacity: 1, ease: "expo.out" })
    } else {
      gsap.to(optionsContainer, { scale: 0, y: '-10%', duration: 1, transformOrigin: 'top', opacity: 0, ease: "power2.out" })
    }

  }, [displayFilterStatus])

  // handle filter status view
  const displayOptions = () => {
    if (displayFilterStatus) {
      setDisplayFilterStatus(false)
    } else {
      setDisplayFilterStatus(true)
    }
  }


  // flexibe ui depending on vierport width 
  function MyComponent() {
    useEffect(() => {
      function handleResize() {
        setWindowSize(window.innerWidth)
      }

      window.addEventListener('resize', handleResize)

      return _ => window.removeEventListener('resize', handleResize)
    })
  }
  MyComponent()

  // animation when page first renders
  useEffect(() => {
    if (invoices.length > 0) {
      const invoices = document.querySelectorAll('.invoice-container')
      gsap.to(invoices, { y: 0, opacity: 1, scale: 1, stagger: 0.1, ease: "back.out(2)", transformOrigin: 'top' })
    }
  }, [filteredInvoices, invoices])



  // display formular and make some css changes
  const handleDisplayForm = () => {

    const invoices = document.querySelector('body')

    if (displayForm) {
      window.scrollTo(0, 0)
      invoices.style.overflowY = 'auto'

      setDisplayForm(false)
    } else {
      window.scrollTo(0, 0)
      invoices.style.overflowY = 'hidden'

      setDisplayForm(true)
    }
  }


  return (
    <div className={darkMode ? 'invoices-dark' : 'invoices'}>
      <div className="invoices-container">
        <div className='header'>
          <div className='title'>
            <h1>Invoices</h1>
            {invoices.length === 0 ?
              (windowSize < 751 ? <p>No Invoices</p> : <p>There are no Invoices</p>) :
              (windowSize < 751 ? <p>{invoices.length} invoice(s)</p> : <p>There are total {invoices.length} invoice(s)</p>)
            }
          </div>
          <div className='management'>
            <div className='filter-status'>
              <p onClick={displayOptions}> {windowSize < 751 ? 'Filter' : 'Filter by Status'}  <i className="fa-solid fa-caret-down"></i></p>
              <div className='status-options-container'>
                <form>
                  <label onClick={() => handleStatusFilter('All')}>
                    <input type="radio" name='status' />
                    <span>All Invoices</span>
                  </label>

                  <label onClick={() => handleStatusFilter('Paid')}>
                    <input type="radio" name='status' />
                    <span>Paid</span>
                  </label>

                  <label onClick={() => handleStatusFilter('Pending')}>
                    <input type="radio" name='status' />
                    <span>Pending</span>
                  </label>

                  <label onClick={() => handleStatusFilter('Draft')}>
                    <input type="radio" name='status' />
                    <span>Draft</span>
                  </label>
                </form>
              </div>
            </div>
            <button onClick={handleDisplayForm} className='btn1'><span className='newInvoiceSpan'>+</span> {windowSize < 550 ? 'New' : 'New Invoice'} </button>
          </div>
        </div>
        <div className={invoices.length === 0 ? 'list-container-empty' : 'list'}>
          {invoices.length === 0 ?
            (<div className='empty'>
              <img src={emptyList} alt="ilustration" />
              <h2>There is nothing here</h2>
              {notFound === '' ?
                <p>  Create an invoice by clicking the <br></br>
                  <span> New Invoice</span>  button and get started
                </p> :
                <p>{notFound}</p>
              }
            </div>
            ) :
            filteredInvoices.map((invoice) => (
              <div onClick={() => navigate(`/invoiceDetail/${invoice.invoiceID}`)} className='invoice-container' key={invoice.invoiceID}>
                <p className='invoice-id'><span>#</span>{invoice.invoiceID}</p>
                <p className='due'>Due {new Date(invoice.due.seconds * 1000).toLocaleDateString("en-UK")}</p>
                <p className='client'>{invoice.clientName}</p>
                <p className='total'>$ {invoice.total}</p>
                <div className={invoice.status}>
                  <p><i className="fa-solid fa-circle"></i> {invoice.status}</p>
                  {windowSize < 751 ? '' : <i className="fa-solid fa-angle-right"></i>}
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {displayForm &&
        <>
          <Formular closeForm={handleDisplayForm} type={'add'} openDemoMessage={() => setDemoMessage(true)} />
          <div className='filter'></div>
        </>
      }


      {demoMessage &&
        <DemoMessage close={() => setDemoMessage(false)} />
      }



    </div>
  )
}

export default Invoices