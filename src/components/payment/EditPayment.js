import React, { useEffect, useState, useRef } from "react"
import useSimpleAuth from "../../hooks/ui/useSimpleAuth"
import "bootstrap/dist/css/bootstrap.min.css"
import NumberFormat from 'react-number-format';
import "./Payment.css"
import { Link } from "react-router-dom"


const EditPayment = props => {
    const [payment, setPayments] = useState({})
    const [merchantName, setMerchant] = useState("")
    const zipCode = useRef()
    const cardNumber = useRef()
    const expDate = useRef()
    const CVC = useRef()

    const setValues = () => {
        setMerchant(props.payment.merchant_name)
        zipCode.current.value = props.payment.zip_code
        cardNumber.current.value = props.payment.account_number
        expDate.current.value = unformatDate(props.payment.expiration_date)
        CVC.current.value = props.payment.security_code
    }

    useEffect(() => {
        setValues()
    }, [])


    const formatDate = (date) => {
        let splitDate = date.split("/")
        return "20" + splitDate[1] + "-" + splitDate[0] + "-01"
    }

    const addPayment = () => {
      fetch(`http://192.168.21.117:8000/payments/${props.payment.id}`, {
          "method": "PUT",
          "headers": {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Token ${localStorage.getItem("bangazon_token")}`
          },
          "body": JSON.stringify({
            merchant_name: merchantName,
            account_number: cardNumber.current.value,
            expiration_date: formatDate(expDate.current.value),
            created_date: new Date(),
            zip_code: zipCode.current.value,
            security_code: CVC.current.value,
            customer_id: localStorage.getItem("id")
          })
      })
      .then(() => props.getPaymentList())
    }

    const updateName = (event) => {
        // console.log(event)
        // event.target.value = event
        setMerchant(event.target.value)
    }

    const updateZip = (event) => {
        zipCode.current.value = event.target.value
    }

    const updateCard = (event) => {
        cardNumber.current.value = event.target.value
    }

    const updateExp = (event) => {
        expDate.current.value = event.target.value
    }

    const updateCvc = (event) => {
        CVC.current.value = event.target.value
    }

    const limit = (val, max) => {
        if (val.length === 1 && val[0] > max[0]) {
          val = '0' + val;
        }

        if (val.length === 2) {
          if (Number(val) === 0) {
            val = '01';

          //this can happen when user paste number
        } else if (val > max) {
            val = max;
          }
        }

        return val;
      }

    const cardExpiry = (val) => {
        let month = limit(val.substring(0, 2), '12');
        let year = val.substring(2, 4);

        return month + (year.length ? '/' + year : '');
    }

    const unformatDate = (date) => {
        let splitDate = date.split("-")
        return splitDate[1] + "/" + splitDate[0].substring(2)
    }

    return(
      <>
          <section className="add-payment">
            <div className="add-form">
              <h1>Add Payment</h1>
              <div className="payment-extra">
                <input onChange={updateName} defaultValue="" placeholder="Merchant name" className="form-control" placeholder={props.payment.merchant_name} ></input>
                <NumberFormat onChange={updateZip} thousandSeparator={true} placeholder={props.payment.zip_code} className="form-control" format="#####" ref={zipCode} />
              </div>
              <div className="payment-important">
                <NumberFormat onChange={updateCard} thousandSeparator={true} placeholder={props.payment.account_number} className="form-control" format="#### #### #### ####" ref={cardNumber} />
                <NumberFormat onChange={updateExp} format={cardExpiry} className="form-control" placeholder={unformatDate(props.payment.expiration_date)} mask={['M', 'M', 'Y', 'Y']} ref={expDate}/>
                <NumberFormat onChange={updateCvc} format="###" className="form-control" placeholder={props.payment.security_code} ref={CVC}/>
              </div>
            </div>
            <div className="confirm-payment">
                <Link className="nav-link nav-color" to={`/payment`}>
                    <button className="change-settings" onClick={addPayment}>Add Payment</button>
                </Link>
            </div>
          </section>
      </>
    )
  }

export default EditPayment