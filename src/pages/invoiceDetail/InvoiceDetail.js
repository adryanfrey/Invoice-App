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

const InvoiceDetail = ({ darkMode }) => {
  // states
  const [invoice, setInvoice] = useState([])
  const { id } = useParams()
  const [user, setUser] = useState({})
  const [filter, setFilter] = useState(false)
  const [display, setDisplay] = useState(false)
  const [windowSize, setWindowSize] = useState(window.innerWidth)

  // imputs states
  const [fromAddress, setFromAddress] = useState('')
  const [fromCity, setFromCity] = useState('')
  const [fromPostCode, setFromPostCode] = useState('')
  const [fromCountry, setFromCountry] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [toAddress, setToAddress] = useState('')
  const [toCity, setToCity] = useState('')
  const [toPostCode, setToPostCode] = useState('')
  const [toCountry, setToCountry] = useState('')
  const [date, setDate] = useState('')
  const [paymentTerms, setPaymentTerms] = useState(1)
  const [description, setDescription] = useState('')
  const [items, setItems] = useState([])
  const [demoMessage, setDemoMessage] = useState(false)

  // navigate
  const navigate = useNavigate('')

  // load invoices
  useEffect(() => {
    const userData = localStorage.getItem('@InvoiceAppUser')
    setUser(JSON.parse(userData))

    async function loadInvoices() {

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
          setInvoice(list)
          setFromAddress(doc.data().fromAddress)
          setFromCity(doc.data().fromCity)
          setFromPostCode(doc.data().fromPostCode)
          setFromCountry(doc.data().fromCountry)
          setClientName(doc.data().clientName)
          setClientEmail(doc.data().clientEmail)
          setToAddress(doc.data().toAddress)
          setToCity(doc.data().toCity)
          setToPostCode(doc.data().toPostCode)
          setToCountry(doc.data().toCountry)
          setPaymentTerms(doc.data().paymentTerms)
          setDescription(doc.data().description)
          setItems(doc.data().items)
        })
      })
    }
    loadInvoices()

  }, [id])

  // display html conditionally
  useEffect(() => {
    const invoiceDetailFilter = document.querySelector('.invoiceDetail-filter')
    const deleteContainer = document.querySelector('.delete-container')


    if (filter) {
      invoiceDetailFilter.style.display = 'block'
      deleteContainer.style.display = 'block'
    } else {
      invoiceDetailFilter.style.display = 'none'
      deleteContainer.style.display = 'none'
    }
  }, [filter])

  useEffect(() => {
    const editForm = document.querySelector('.editInvoice')
    const invoiceDetailFilter = document.querySelector('.invoiceDetail-filter')
    const invoiceDetail = document.querySelector('.invoiceDetail')

    if (display) {
      gsap.to(editForm, { x: 0, duration: 1, ease: "power2.out" })
      gsap.to(invoiceDetailFilter, { display: 'block' })
    } else {
      gsap.to(invoiceDetailFilter, { display: 'none' })
      gsap.to(editForm, { x: '-100%', duration: 1 })
    }

  }, [display])

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

  // edit inputs 

  // add item
  const addItem = () => {
    setItems([...items, { name: '', qty: 0, price: '', total: 0 }])
  }

  // delete item
  const deleteItem = (index, name) => {
    const currentItems = [...items]
    currentItems.splice(index, 1)
    setItems(currentItems)
  }

  // handle input change
  const handleChange = (e, i) => {
    const { name, value } = e.target
    const list = [...items]

    const checkValue = (value) => {
      if (value < 0) {
        value = 0
      }
      return value
    }

    list[i][name] = checkValue(value)
    list[i]['total'] = list[i]['qty'] * list[i]['price']
    setItems(list)
  }

  // edit invoice
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (user.uid === 'Q50NZbnvYuS80aESngpKoIIApHz2') {
      setDemoMessage(true)
      return
    }

    // generate the due date of the invoice
    let dueDate = new Date(date)
    dueDate.setDate(dueDate.getDate() + paymentTerms)
    // convert date format
    let convertedDate = new Date(date)

    // total of the invoice items
    const addItemPrices = () => {
      let total = 0
      items.map((item) => {
        total += item.total
        return 0
      })
      return total
    }
    const total = addItemPrices()

    let status = undefined

    if (invoice[0].status === 'Draft') {
      status = 'Pending'
    } else {
      status = 'Pending'
    }

    const docRef = doc(db, 'invoices', invoice[0].id)
    await updateDoc(docRef, {
      fromAddress,
      fromCity,
      fromCountry,
      fromPostCode,
      clientName,
      clientEmail,
      toAddress,
      toCity,
      toPostCode,
      toCountry,
      date: convertedDate,
      due: dueDate,
      paymentTerms,
      description,
      items,
      total: total,
      status
    }).then(() => {
      setDisplay(false)
      toast.success('Invoice updated successfully')
    })
      .catch(() => {
        toast.warn('Sorry there was an error try again latter')
      })

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
    const demoMessageContainer2 = document.querySelector('.demoMessage-container2')
    const filter2Detail = document.querySelector('.filter2Detail')

    if (demoMessage) {
      demoMessageContainer2.style.display = 'flex'
      filter2Detail.style.display = 'block'
    } else {
      demoMessageContainer2.style.display = 'none'
      filter2Detail.style.display = 'none'
    }

  }, [demoMessage])

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
                <button onClick={() => setDisplay(true)} className='btn3-light'>Edit</button>
              }
              <button onClick={() => setFilter(true)} className='btn5'>Delete</button>
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

          <div className='btn-container'>
            {invoice[0].status === 'Paid' ? '' :
              <button onClick={() => {
                setDisplay(true)
                window.scrollTo(0,0)
              }} className='btn3-light'>Edit</button>
            }
            <button onClick={() => {
              window.scrollTo(0,0)
              setFilter(true)}} className='btn5'>Delete</button>
            {invoice[0].status === 'Paid' || invoice[0].status === 'Draft' ? '' :
              <button id='markPaid' onClick={handleInvoiceStatus} className='btn2'>Mark as Paid</button>
            }
          </div>
        </div>
      }
      <div className='invoiceDetail-filter'></div>
      <div className='delete-container'>
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete invoice {id}? This action cannot be undone.</p>
        <div>
          <button onClick={() => setFilter(false)} className='btn3-light'>Cancel</button>
          <button onClick={handleDelete} className='btn5'>Delete</button>
        </div>
      </div>

      {/* Edit invoice */}

      <form onSubmit={(e) => handleSubmit(e)} className='editInvoice'>
        <h2>Edit Invoice</h2>
        <p className='sub-title'>Bill from</p>

        <div className='input-container'>
          <label className="big-input" >
            <span>Street Address</span>
            <input value={fromAddress} onChange={(e) => setFromAddress(e.target.value)} required type="text" placeholder='Street address' />
          </label>


          <div className='small-input-container'>
            <label className='small-input'>
              <span>City</span>
              <input value={fromCity} onChange={(e) => setFromCity(e.target.value)} required type="text" placeholder='City' />
            </label>

            <label className='small-input'>
              <span>Post Code</span>
              <input value={fromPostCode} onChange={(e) => setFromPostCode(e.target.value)} required type="text" placeholder='Post Code' />
            </label>

            <label className='small-input last'>
              <span>Country</span>
              <input value={fromCountry} onChange={(e) => setFromCountry(e.target.value)} required type="text" placeholder='Country' />
            </label>
          </div>
        </div>

        <p className='sub-title'>Bill To</p>

        <div className='input-container'>
          <label className="big-input" >
            <span>Client’s Name</span>
            <input value={clientName} onChange={(e) => setClientName(e.target.value)} required type="text" placeholder='Name' />
          </label>

          <label className="big-input" >
            <span>Client’s Email</span>
            <input value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} required type="email" placeholder='Email' />
          </label>

          <label className="big-input" >
            <span>Street Address</span>
            <input value={toAddress} onChange={(e) => setToAddress(e.target.value)} required type="text" placeholder='Address' />
          </label>


          <div className='small-input-container'>
            <label className='small-input'>
              <span>City</span>
              <input value={toCity} onChange={(e) => setToCity(e.target.value)} required type="text" placeholder='City' />
            </label>

            <label className='small-input'>
              <span>Post Code</span>
              <input value={toPostCode} onChange={(e) => setToPostCode(e.target.value)} required type="text" placeholder='Post Code' />
            </label>

            <label className='small-input last'>
              <span>Country</span>
              <input value={toCountry} onChange={(e) => setToCountry(e.target.value)} required type="text" placeholder='Country' />
            </label>
          </div>

          <div className='date-input'>
            <label>
              <span>Invoice Date</span>
              <input value={date} onChange={(e) => setDate(e.target.value)} required type="date" placeholder='Date' />
            </label>

            <label>
              <span>Payment terms</span>
              <select onChange={(e) => setPaymentTerms(+e.target.value)} required>
                <option value={1}>Net 1 day</option>
                <option value={7}>Net 7 days</option>
                <option value={14}>Net 14 days</option>
                <option value={30}>Net 30 days</option>
              </select>
            </label>
          </div>

          <label className='big-input'>
            <span>Project Description</span>
            <input value={description} onChange={(e) => setDescription(e.target.value)} required type="text" placeholder='Description' />
          </label>
        </div>

        <div className='item-list'>
          <h3>Item list</h3>
          {items.map((item, index) => (
            <div className='input-container-item' key={index}>
              <label className='item-input'>
                <span>Item Name</span>
                <input required type="text" placeholder='Item' value={item.item} name='item' onChange={(e) => handleChange(e, index)} />
              </label>

              <label className='qty-input'>
                <span>Qty.</span>
                <input required type="number" maxLength={1} name='qty' value={item.qty} placeholder='0' onChange={(e) => handleChange(e, index)} />
              </label>

              <label className='price-input'>
                <span>Price</span>
                <input required value={item.price} type="number" placeholder='Price' name='price' onChange={(e) => handleChange(e, index)} />
              </label>

              <div className='total'>
                <span>Total</span>
                <p>{item.total}</p>
              </div>
              <i onClick={() => deleteItem(index, item.name)} className="fa-solid fa-trash"></i>
            </div>
          ))}
        </div>
        <button type='button' onClick={addItem} className='btn2'>+ Add New Item</button>

        <div className='save-changes'>
          <button onClick={() => setDisplay(false)} type='button' className='btn3-light'>Cancel</button>
          <button type='submit' className='btn2'> {windowSize < 550 ? 'Save' : 'Save & Send'} </button>
        </div>
      </form>

      <div className='filter2Detail'></div>
      <div className="demoMessage-container2">
        <h2>Create an account <br></br> to start using Invoice App :)</h2>
        <Link to='/register'>Register</Link>
        <button onClick={() => setDemoMessage(false)} className='btn5'>Cancel</button>
      </div>
    </div>
  )
}

export default InvoiceDetail