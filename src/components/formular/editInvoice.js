import { toast } from "react-toastify"
import { db } from '../../firebase/config'
import { doc, updateDoc } from 'firebase/firestore'

// edit invoice
const editInvoice = async (data, openDemoMessage, closeForm) => {

  // get user data
  const userData = localStorage.getItem('@InvoiceAppUser')
  const user = JSON.parse(userData)

  if (user.uid === 'Q50NZbnvYuS80aESngpKoIIApHz2') {
    openDemoMessage()
    return
  }

  // generate the due date of the invoice
  let dueDate = new Date(data.date)
  dueDate.setDate(dueDate.getDate() + data.paymentTerms)
  // convert date format
  let convertedDate = new Date(data.date)

  // total of the invoice items
  const addItemPrices = () => {
    let total = 0
    data.items.map((item) => {
      total += item.total
      return 0
    })
    return total
  }
  const total = addItemPrices()

  // api request
  const docRef = doc(db, 'invoices', data.id)
  await updateDoc(docRef, {
    fromAddress: data.fromAddress,
    fromCity: data.fromCity,
    fromCountry: data.fromCountry,
    fromPostCode: data.fromPostCode,
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    toAddress: data.toAddress,
    toCity: data.toCity,
    toPostCode: data.toPostCode,
    toCountry: data.toCountry,
    date: convertedDate,
    due: dueDate,
    paymentTerms: data.paymentTerms,
    description: data.description,
    items: data.items,
    total: total,
    status: data.status
  }).then(() => {
    toast.success('Invoice updated successfully')
    closeForm()
  })
    .catch(() => {
      toast.warn('Sorry there was an error try again latter')
    })

}

export { editInvoice }