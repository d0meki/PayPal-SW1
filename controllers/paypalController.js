const { response, request } = require('express')
const solicitud = require("request");
const auth = { user:process.env.CLIENT,pass:process.env.SECRET }


const executePayment = (req,res)=>{
    const token = req.query.token;
   // console.log(`${process.env.PAYPAL_API}/v2/checkout/orders/${token}/capture`);
    solicitud.post(`${process.env.PAYPAL_API}/v2/checkout/orders/${token}/capture`,{
        auth,
        body:{},
        json:true
    }, (err,respuesta)=>{
        res.json({data:respuesta.body})
    } )
}

const createPayment = (req,res)=>{
    const body = {
        intent:'CAPTURE',
        purchase_units:[{
            amount:{
                currency_code:'USD',
                value: '200'
            }
        }],
        application_context: {
            brand_name: `TusDonaciones.com`,
            landing_page: 'NO_PREFERENCE',
            user_action: 'PAY_NOW',
            return_url: `http://localhost:8080/api/paypal/execute-payment`,
            cancel_url: `http://localhost:8080/api/paypal/cancel-payment`,
        }
    }
    solicitud.post(`${process.env.PAYPAL_API}/v2/checkout/orders`,{
        auth,
        body,
        json: true
    },(err,respuesta)=>{
        res.json({data:respuesta.body})
    })
}




const paypalGet = (req ,res) =>{
    const query = req.query;
    res.json({
        msg:'get API - Controlador',
        query
    })
}
// const solicitud = require("request");
// const fs = require("fs");
// const firebase = require("firebase-admin");
// const serviceAccount = require('../privateKey.json');

module.exports = {
    paypalGet,
    createPayment,
    executePayment
}