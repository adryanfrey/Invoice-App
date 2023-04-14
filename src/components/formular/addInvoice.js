import { toast } from "react-toastify"
import { db } from '../../firebase/config'
import { addDoc, collection } from 'firebase/firestore'

// add invoice
  const addInvoice = async (data,openDemoMessage, closeForm, type = 'Pending') => {
  
    console.log('aaaaa')

    const userData = localStorage.getItem('@InvoiceAppUser')
    const user = JSON.parse(userData)

    if (user.uid === 'Q50NZbnvYuS80aESngpKoIIApHz2') {
      console.log('passou')
      openDemoMessage()
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
    if (data.date !== '') {
      // generate the due date of the invoice
      dueDate = new Date(data.date)
      dueDate.setDate(dueDate.getDate() + data.paymentTerms)
      // convert date format
      convertedDate = new Date(data.date)
    }

    console.log(convertedDate)

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


    await addDoc(collection(db, 'invoices'), {
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
      status: type,
      created: new Date(),
      uid: user.uid,
      invoiceID: idRandom,
      items: data.items,
      total: total
    })
      .then(() => {
        toast.success('Invoice added succesfully')
        closeForm()
      })
      .catch((e) => {
        toast.warn('Sorry there was an error, try again later')
        console.log(e)
      })
  }

export {addInvoice}