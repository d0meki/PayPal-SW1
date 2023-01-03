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
        //almacenarla en la BD antes de ebviar la respuesta al frot
        //res.json({data:respuesta.body})
        const pago = {
            id:respuesta.body.id,
            nombre:respuesta.body.purchase_units[0].shipping.name.full_name,
            moneda:respuesta.body.purchase_units[0].payments.captures[0].amount.currency_code,
            monto:respuesta.body.purchase_units[0].payments.captures[0].amount.value,
            correo:respuesta.body.payer.email_address
        }
        solicitud.post('http://35.198.23.51:8080/api/registrarPagoPayPal',{body:pago,
        json:true},(err,resp)=>{
            res.redirect('https://www.sandbox.paypal.com/')
        })
    } )
}

const createPayment = (req,res)=>{
    const {monto,codigo_moneda} = req.body;
    if (monto<=0) {
        res.json({data:req.body,
            estado:false,
            msg:"Monto No Valido"})
    }
    if (codigo_moneda == '') {
        res.json({data:req.body,
            estado:false,
            msg:"Codigo Moneda No Valido"})
    }
    // const body = {
    //     intent:'CAPTURE',
    //     purchase_units:[{
    //         amount:{
    //             currency_code:codigo_moneda,
    //             value: monto
    //         }
    //     }],
    //     application_context: {
    //         brand_name: `TusDonaciones.com`,
    //         landing_page: 'NO_PREFERENCE',
    //         user_action: 'PAY_NOW',
    //         return_url: `http://localhost:8080/api/paypal/execute-payment`,
    //         cancel_url: `http://localhost:8080/api/paypal/cancel-payment`,
    //     }
    // }
    const body = {
        intent:'CAPTURE',
        purchase_units:[{
            amount:{
                currency_code:codigo_moneda,
                value: monto
            }
        }],
        application_context: {
            brand_name: `TusDonaciones.com`,
            landing_page: 'NO_PREFERENCE',
            user_action: 'PAY_NOW',
            return_url: `http://35.198.23.51:8080/api/paypal/execute-payment`,
            cancel_url: `http://35.198.23.51:8080/api/paypal/cancel-payment`,
        }
    }
    solicitud.post(`${process.env.PAYPAL_API}/v2/checkout/orders`,{
        auth,
        body,
        json: true
    },(err,respuesta)=>{
        res.json({data:respuesta.body,
            estado:true,
            msg:"Puede Continuar con la transaccion"})
       // res.json({data:respuesta.body})
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