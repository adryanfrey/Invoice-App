import React from 'react'
import { useState, useEffect } from 'react'
import { addInvoice } from './addInvoice'
import { editInvoice } from './editInvoice'
import './styles.sass'
import { toast } from 'react-toastify'
import { gsap } from 'gsap'

const Formular = ({ type, closeForm, openDemoMessage, invoice }) => {

    // convert invoice date format
    const dateObject = new Date(invoice?.date.seconds * 1000)
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Add 1 to month, as it's zero-based
    const day = String(dateObject.getDate()).padStart(2, '0');
    
    const formatedDate = `${year}-${month}-${day}`
    const [windowSize, setWindowSize] = useState()

    // imputs states
    const [fromAddress, setFromAddress] = useState(invoice?.fromAddress)
    const [fromCity, setFromCity] = useState(invoice?.fromCity)
    const [fromPostCode, setFromPostCode] = useState(invoice?.fromPostCode)
    const [fromCountry, setFromCountry] = useState(invoice?.fromCountry)
    const [clientName, setClientName] = useState(invoice?.clientName)
    const [clientEmail, setClientEmail] = useState(invoice?.clientEmail)
    const [toAddress, setToAddress] = useState(invoice?.toAddress)
    const [toCity, setToCity] = useState(invoice?.toCity)
    const [toPostCode, setToPostCode] = useState(invoice?.toPostCode)
    const [toCountry, setToCountry] = useState(invoice?.toCountry)
    const [date, setDate] = useState(formatedDate)
    const [paymentTerms, setPaymentTerms] = useState(invoice?.paymentTerms)
    const [description, setDescription] = useState(invoice?.description)
    const [items, setItems] = useState(invoice?.items ? invoice?.items : [{ item: '', qty: 0, price: '' }])

    const data = {
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
        date,
        paymentTerms,
        description,
        items,
        type,
        status: invoice?.status,
        id: invoice?.id  
    }

    // form animation
    useEffect(() => {
        gsap.to('.newInvoice', { x: 0, duration: 0.7, ease: "power2.out" })
    }, [])

    // edit or add invoice
    const handleSave = (e) => {
        e.preventDefault()

        if (items[0].qty === 0) {
            toast.warn('Fill the item field in your invoice')
            return
        }

        if (type === 'add') {
            addInvoice(data, openDemoMessage, closeForm)
        } else {
            editInvoice(data, openDemoMessage, closeForm)
        }
    }

    // handle draft
    const handleDraft = () => {
        addInvoice(data, openDemoMessage, closeForm, 'Draft')
    }

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

    // handle item input change
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

    // handle discard
    const discard = () => {
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

        gsap.to('.newInvoice', { x: '-110%', duration: 0.7, ease: "power2.out" })

        setTimeout(() => {
            closeForm()
        }, 350)
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

    return (
        <form onSubmit={(e) => handleSave(e)} className='newInvoice'>
            <h2>
                {type === 'add' ? 'New Invoice' : 'Edit Invoice'}
            </h2>
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
                        <input onChange={(e) => setDate(e.target.value)} value={date} required type="date" placeholder={date} />
                    </label>

                    <label>
                        <span>Payment terms</span>
                        <select value={paymentTerms} onChange={(e) => setPaymentTerms(+e.target.value)} required>
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
                {items?.map((item, index) => (
                    <div className='input-container-item' key={index}>
                        <label className='item-input'>
                            <span>Item Name</span>
                            <input required type="text" value={item.item} placeholder='Item' name='item' onChange={(e) => handleChange(e, index)} />
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
                <button onClick={discard} type='button' className='btn3-light discard'>{type === 'add' ? 'Discard' : 'Cancel'}</button>
                {type === 'add' && <button className='btn4' type='button' onClick={handleDraft}> {windowSize < 550 ? 'Draft' : 'Save as Draft'}</button>}
                <button className='btn2'> {windowSize < 550 ? 'Save' : 'Save & Send'}</button>
            </div>
        </form>
    )
}

export default Formular