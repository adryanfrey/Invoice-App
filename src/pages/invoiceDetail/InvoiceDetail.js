// sass
import './invoiceDetail.sass'

// hooks
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

// firebase
import { db } from '../../firebase/config'
import { collection, query, onSnapshot, where, deleteDoc, doc, updateDoc } from 'firebase/firestore'

// react toastify
import { toast } from 'react-toastify'

// gsap
import { gsap } from 'gsap'

// components
import Formular from '../../components/formular/Formular'
import DemoMessage from '../../components/demoMessage/DemoMessage'

const InvoiceDetail = ({ darkMode }) => {
  // states
  const [invoice, setInvoice] = useState([])
  const { id } = useParams()
  const [user, setUser] = useState({})
  const [deleteModal, setDeleteModal] = useState(false)
  const [displayForm, setDisplayForm] = useState(false)
  const [demoMessage, setDemoMessage] = useState(false)

  // navigate
  const navigate = useNavigate('')

  // get invoice by id
  useEffect(() => {
    const userData = localStorage.getItem('@InvoiceAppUser')
    setUser(JSON.parse(userData))

    async function loadInvoice() {
      const taskRef = collection(db, "invoices")
      const q = query(taskRef, where('invoiceID', '==', id))

      onSnapshot(q, (snapshot) => {
        let list = []

        snapshot.forEach((doc) => {
          list.push({
            id: doc.id,
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
            items: doc.data().items
          })
        })

        setInvoice(list)
      })
    }
    loadInvoice()

  }, [id])

  // delete invoice
  const handleDelete = async () => {
    if (user.uid === 'Q50NZbnvYuS80aESngpKoIIApHz2') {
      setDemoMessage(true)
      return
    }
    const docRef = doc(db, 'invoices', invoice[0].id)

    await deleteDoc(docRef)
      .then(() => {
        navigate('/invoices')
        toast.success('Invoice deleted succesfully')
      })
      .catch(() => {
        toast.warn('Sorry there was an error, try again later')
      })
  }

  // mark invoice as paid
  const handleInvoiceStatus = async () => {
    if (user.uid === 'Q50NZbnvYuS80aESngpKoIIApHz2') {
      setDemoMessage(true)
      return
    }

    const docRef = doc(db, 'invoices', invoice[0].id)

    if (invoice[0].status === 'Draft') {

      await updateDoc(docRef, {
        status: 'Pending'
      })
        .then(() => {
          toast.success('Invoice marked as pending')
        })
        .catch(() => {
          toast.warn('Sorry there was an error')
        })
    } else {

      await updateDoc(docRef, {
        status: 'Paid'
      })
        .then(() => {
          toast.success('Invoice marked as paid')
        })
        .catch(() => {
          toast.warn('Sorry there was an error')
        })
    }
  }

  // animation on first render
  useEffect(() => {
    if (invoice.length !== 0) {
      const editContainer = document.querySelector('.edit-invoice-container')
      const invoiceContainer = document.querySelector('.invoice-details')

      gsap.to(editContainer, { y: '50%', opacity: 1, ease: "circ.out" })
      gsap.to(invoiceContainer, { y: 0, opacity: 1, ease: "circ.out" })
    }

  }, [invoice])

  // display demo message
  useEffect(() => {


  }, [demoMessage])


  // display the form and change some css for better user experience
  const handleDisplayForm = () => {

    const invoiceDetail = document.querySelector('.invoiceDetail')
    const invoiceDetailDark = document.querySelector('.invoiceDetail-dark')

    if (displayForm) {
      if (invoiceDetail === null) {
        invoiceDetailDark.style.overflowY = 'auto'
      } else {
        invoiceDetail.style.overflowY = 'auto'
      }

      setDisplayForm(false)
    } else {
      if (invoiceDetail === null) {
        invoiceDetailDark.scrollTo(0, 0)
        invoiceDetailDark.style.overflowY = 'hidden'
      } else {
        invoiceDetail.scrollTo(0, 0)
        invoiceDetail.style.overflowY = 'hidden'
      }

      setDisplayForm(true)
    }
  }

  // display the deleteModal and make some css changes
  const handleDisplayDeleteModal = () => {
    const invoiceDetail = document.querySelector('.invoiceDetail')
    const invoiceDetailDark = document.querySelector('.invoiceDetail-dark')

    if (deleteModal) {
      if (invoiceDetail === null) {
        invoiceDetailDark.style.overflowY = 'auto'
      } else {
        invoiceDetail.style.overflowY = 'auto'
      }

      setDeleteModal(false)
    } else {
      if (invoiceDetail === null) {
        invoiceDetailDark.scrollTo(0, 0)
        invoiceDetailDark.style.overflowY = 'hidden'
      } else {
        invoiceDetail.scrollTo(0, 0)
        invoiceDetail.style.overflowY = 'hidden'
      }

      setDeleteModal(true)
    }

  }


  return (
    <div className={darkMode ? 'invoiceDetail-dark' : 'invoiceDetail'}>
      {invoice.length === 0 ? '' :
        <div className="invoiceDetail-container">
          <p onClick={() => navigate('/invoices')} className='goBack'><i className="fa-solid fa-angle-left"></i> Go Back</p>

          <div className='edit-invoice-container'>
            <div className={invoice[0].status}>
              <span>Status</span>
              <p><i className="fa-solid fa-circle"></i> {invoice[0].status}</p>
            </div>
            <div className='edit'>
              {invoice[0].status === 'Paid' ? '' :
                <button onClick={handleDisplayForm} className='btn3-light'>Edit</button>
              }
              <button onClick={handleDisplayDeleteModal} className='btn5'>Delete</button>
              {invoice[0].status === 'Paid' || invoice[0].status === 'Draft' ? '' :
                <button id='markPaid' onClick={handleInvoiceStatus} className='btn2'>Mark as Paid</button>
              }
            </div>
          </div>

          <div className='invoice-details'>
            <div className='group1'>
              <div className='invoice-description'>
                <h3><span>#</span>{invoice[0].invoiceID}</h3>
                <p>{invoice[0].description}</p>
              </div>
              <div className='address-from'>
                <p>{invoice[0].fromAddress}</p>
                <p>{invoice[0].fromCity}</p>
                <p>{invoice[0].fromPostCode}</p>
                <p>{invoice[0].fromCountry}</p>
              </div>
            </div>
            <div className="group2">
              <div className='dates'>
                <div className='invoice-date'>
                  <span>Invoice Date</span>
                  <p>{new Date(invoice[0].date.seconds * 1000).toLocaleDateString("en-UK")}</p>
                </div>
                <div className='invoice-date'>
                  <span>Payment due</span>
                  <p>{new Date(invoice[0].due.seconds * 1000).toLocaleDateString("en-UK")}</p>
                </div>
              </div>
              <div className='address-to'>
                <span>Bill To</span>
                <p className='clientName'>{invoice[0].clientName}</p>
                <p>{invoice[0].toAddress}</p>
                <p>{invoice[0].toCity}</p>
                <p>{invoice[0].toPostCode}</p>
                <p>{invoice[0].toCountry}</p>
              </div>
              <div className='email'>
                <span>Sent To</span>
                <p>{invoice[0].clientEmail}</p>
              </div>
            </div>
            <div className="group3">
              <div className='titles'>
                <p className='name'>Item Name</p>
                <p className='qty'>QTY.</p>
                <p className='price'>Price</p>
                <p className='total'>Total</p>
              </div>

              <div className='items'>
                {invoice[0].items.map((item, i) => (
                  <div className='item' key={i}>
                    <p className='name'>{item.item}</p>
                    <p className='qty'>{item.qty}x</p>
                    <p className='price'>$ {item.price}</p>
                    <p className='total'>$ {item.total}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className='amount-due'>
              <span>Amount Due</span>
              <p>$ {invoice[0].total}</p>
            </div>
          </div>


          {/* btn container on mobile devices */}
          <div className='btn-container'>
            {invoice[0].status === 'Paid' ? '' :
              <button onClick={handleDisplayForm} className='btn3-light'>Edit</button>
            }
            <button onClick={handleDisplayDeleteModal} className='btn5'>Delete</button>
            {invoice[0].status === 'Paid' || invoice[0].status === 'Draft' ? '' :
              <button id='markPaid' onClick={handleInvoiceStatus} className='btn2'>Mark as Paid</button>
            }
          </div>

        </div>
      }


      {deleteModal &&
        <>
          <div className='delete-container'>
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete invoice {id}? This action cannot be undone.</p>
            <div>
              <button onClick={handleDisplayDeleteModal} className='btn3-light'>Cancel</button>
              <button onClick={handleDelete} className='btn5'>Delete</button>
            </div>
          </div>
          <div className='delete-filter'></div>
        </>

      }

      {displayForm &&
        <>
          <Formular closeForm={handleDisplayForm} openDemoMessage={() => setDemoMessage(true)} type={'edit'} invoice={invoice[0]} />
          <div className='formFilter'></div>
        </>
      }

      {demoMessage &&
        <DemoMessage close={() => setDemoMessage(false)} />
      }
    </div>
  )
}

export default InvoiceDetail