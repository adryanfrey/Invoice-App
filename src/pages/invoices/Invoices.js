// sass
import './invoices.sass'

// hooks
import { useEffect, useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'

// assets
import emptyList from '../../assets/emptyList.png'

// gsap
import { gsap } from 'gsap'

// firebase
import { db } from '../../firebase/config'
import { addDoc, onSnapshot, query, orderBy, collection, where } from 'firebase/firestore'

// react toastify
import { toast } from 'react-toastify'

const Invoices = ({ darkMode }) => {
  const [invoices, setInvoices] = useState([])
  const [display, setDisplay] = useState(false)
  const [user, setUser] = useState({})
  const navigate = useNavigate('')
  const [displayFilterStatus, setDisplayFilterStatus] = useState(false)
  const [notFound, setNotFound] = useState('')
  const [windowSize, setWindowSize] = useState(window.innerWidth)
  const [demoMessage, setDemoMessage] = useState(false)

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
  const [items, setItems] = useState([{ name: '', qty: 0, price: '', total: 0 }])

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
        })
      })
    }
    loadInvoices()
  }, [])

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
    let { name, value } = e.target
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

  // add invoice
  const handleSubmit = async (e, type = 'Pending') => {
    if (e !== '') {
      e.preventDefault()
    }

    if (user.uid === 'Q50NZbnvYuS80aESngpKoIIApHz2') {
      setDemoMessage(true)
      return
    }

    // generate random id for the invoice
    function makeIdLetters(length) {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }
      return result
    }
    const randomLetters = makeIdLetters(2)

    function makeIdNumbers(length) {
      let result = '';
      const characters = '0123456789';
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }
      return result
    }
    const randomNumbers = makeIdNumbers(4)
    const idRandom = randomLetters + randomNumbers



    let dueDate = ''
    let convertedDate = ''
    if (date !== '') {
      // generate the due date of the invoice
      dueDate = new Date(date)
      dueDate.setDate(dueDate.getDate() + paymentTerms)
      // convert date format
      convertedDate = new Date(date)
    }

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

    await addDoc(collection(db, 'invoices'), {
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
      status: type,
      created: new Date(),
      uid: user.uid,
      invoiceID: idRandom,
      items,
      total: total
    })
      .then(() => {
        toast.success('Invoice added succesfully')
        setDisplay(false)
        setFromAddress('')
        setFromCity('')
        setFromPostCode('')
        setFromCountry('')
        setClientName('')
        setClientEmail('')
        setToAddress('')
        setToCity('')
        setToPostCode('')
        setToCountry('')
        setDate('')
        setPaymentTerms('')
        setDescription('')
      })
      .catch((e) => {
        toast.warn('Sorry there was an error, try again later')
        console.log(e)
      })
  }

  // handle discard
  const discard = () => {
    setDisplay(false)
    setFromAddress('')
    setFromCity('')
    setFromPostCode('')
    setFromCountry('')
    setClientName('')
    setClientEmail('')
    setToAddress('')
    setToCity('')
    setToPostCode('')
    setToCountry('')
    setDate('')
    setPaymentTerms('')
    setDescription('')
  }

  // handle draft
  const handleDraft = () => {
    handleSubmit('', 'Draft')
  }

  // display form (add items)
  useEffect(() => {
    const form = document.querySelector('.newInvoice')
    const filter = document.querySelector('.filter')

    const displayForm = () => {
      if (display) {
        gsap.to(form, { x: 0, duration: 1, ease: "power2.out" })
        gsap.to(filter, { display: 'block' })
      } else {
        gsap.to(filter, { display: 'none' })
        gsap.to(form, { x: '-110%', duration: 1 })

      }
    }
    displayForm()

  }, [display])


  // filter invoices by status
  const handleStatusFilter = async (status) => {

    async function loadInvoices(status) {

      const taskRef = collection(db, "invoices")
      let q = query(taskRef, orderBy('created', 'desc'), where('status', '==', status))

      if (status === 'All') {
        q = query(taskRef, orderBy('created', 'desc'), where('uid', '==', user.uid))
      }

      await onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
          setInvoices([])
          if (status === 'All') {
            setNotFound('')
          } else {
            setNotFound(`There are no ${status} invoices`)
          }
        } else {
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
          })
        }
      })
    }
    loadInvoices(status)

  }

  // check if display filter status is false or true
  useEffect(() => {
    const optionsContainer = document.querySelector('.status-options-container')

    if (displayFilterStatus) {
      gsap.to(optionsContainer, { scale: 1, y: 0, duration: 1, transformOrigin: 'top', opacity: 1, ease: "expo.out" })
    } else {
      gsap.to(optionsContainer, { scale: 0, y: '-10%', duration: 1, transformOrigin: 'top', opacity: 0, ease: "power2.out" })
    }

  }, [displayFilterStatus])

  // display filter status options
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
      gsap.to(invoices, { y: 0, opacity: 1, scale: 1, stagger: 0.2, ease: "back.out(2)", transformOrigin: 'top' })
    }
  }, [invoices])

  // display demo message
  useEffect(() => {
    const demoMessageContainer = document.querySelector('.demoMessage-container')
    const filter2 = document.querySelector('.filter2')

    if (demoMessage) {
      demoMessageContainer.style.display = 'flex'
      filter2.style.display = 'block'
    } else {
      demoMessageContainer.style.display = 'none'
      filter2.style.display = 'none'
    }

  },[demoMessage])

  return (
    <div onSubmit={(e) => handleSubmit(e)} className={darkMode ? 'invoices-dark' : 'invoices'}>
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
                    <input type="radio" name='status' value='Paid' />
                    <span>All Invoices</span>
                  </label>

                  <label onClick={() => handleStatusFilter('Paid')}>
                    <input type="radio" name='status' value='Paid' />
                    <span>Paid</span>
                  </label>

                  <label onClick={() => handleStatusFilter('Pending')}>
                    <input type="radio" name='status' value='Pending' />
                    <span>Pending</span>
                  </label>

                  <label onClick={() => handleStatusFilter('Draft')}>
                    <input type="radio" name='status' value='Draft' />
                    <span>Draft</span>
                  </label>
                </form>
              </div>
            </div>
            <button onClick={() => setDisplay(true)} className='btn1'><span className='newInvoiceSpan'>+</span> {windowSize < 550 ? 'New' : 'New Invoice'} </button>
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
            invoices.map((invoice) => (
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

      <form className='newInvoice'>
        <h2>New Invoice</h2>
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
              <input onChange={(e) => setDate(e.target.value)} required type="date" placeholder='Date' />
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
                <input required type="text" placeholder='Item' name='item' onChange={(e) => handleChange(e, index)} />
              </label>

              <label className='qty-input'>
                <span>Qty.</span>
                <input required type="number" value={item.qty} maxLength={1} name='qty' placeholder='0' onChange={(e) => handleChange(e, index)} />
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
          <button onClick={() => discard()} type='button' className='btn3-light discard'>Discard</button>
          <button className='btn4' type='button' onClick={handleDraft}> {windowSize < 550 ? 'Draft' : 'Save as Draft'}</button>
          <button type='submit' className='btn2'> {windowSize < 550 ? 'Save' : 'Save & Send'}</button>
        </div>
      </form>
      <div className='filter'></div>
      <div className='filter2'></div>
      <div className="demoMessage-container">
        <h2>Create an account <br></br> to start using Invoice App :)</h2>
        <Link to='/register'>Register</Link>
        <button onClick={() => setDemoMessage(false)} className='btn5'>Cancel</button>
      </div>

    </div>
  )
}

export default Invoices