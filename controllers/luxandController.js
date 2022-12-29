const { response, request } = require('express')
const solicitud = require("request");
const fs = require("fs");
const firebase = require("firebase-admin");
const serviceAccount = require('../privateKey.json');

//const firebaseToken = 'dt4Bvc-QQGSODXWYp2hUaV:APA91bH4pW9NJhwTgEHYvVZwmg8jc3iKYk8mXVLVcvMNmBPCklavnNe2lf-hUAz7c4asUSs_hAAmKZQIYF2ZbfICkBl3mSIeCAMTUvJpLF4s8fdFMx6nrCCJ5DoO26REhdDZXUuN6-qc';

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
});

const algoGet = (req = request,res = response) =>{
    const query = req.query;
    //tambien podemos desestructurar
    //const {q,nombre = 'No Name',apiKey} =req.query;
    res.json({
        msg:'get API - Controlador',
        query
    })
}

const crearCaraPost = (req=request,res=response) =>{
    const { name, url } = req.body;
    const options = {
        method: 'POST',
        url: "https://api.luxand.cloud/subject/v2",
        qs: {"name":name,"store":"1"},
        headers: {
            'token': process.env.API_TOKEN
        },
        formData: { 
            photo: url 
        }
    };
    solicitud(options, function (error, response, body) {
        if (error) throw new Error(error);
        const nuevoBody = JSON.parse(body);
        res.json({
            msg:'post API - Controlador',
            body: nuevoBody
        })
    });
}

const algoPut = (req=request,res = response) =>{
    //res.send('hello World');

    const id = req.params.id;

    res.json({
        msg:'put API - Controlador',
        id
    })
}
const algoPost = (req=request,res = response) =>{
    //res.send('hello World');
   // const body = req.body;
    //podemos desustructurar
    const { url } = req.body;
    const options = {
        method: 'POST',
        url: "https://api.luxand.cloud/photo/search",
        qs: {},
        headers: {
            'token': process.env.API_TOKEN
        },
        formData: {
             photo: url 
        }
    };
    solicitud(options, function (error, response, body) {
        const nuevoBody = JSON.parse(body);
        res.json({
            msg:'post API - Controlador',
            body: nuevoBody
        })
    });  
}
const notificacionesPost = (req,res=response) =>{
    const { tittle, body ,token, image } = req.body;
    const payload = {
        notification: {
            title: tittle,
            body:body,
            image:image,
            //click_action: 'FLUTTER_NOTIFICATION_CLICK'
        },
        //image:image,
        data:{
            data1:'data1 value',
            data2: 'data2 value'
        }
    };
    const options  = { priority: 'high',timeToLive: 60 * 60 * 24,};

    firebase.messaging().sendToDevice(token,payload,options).then(response=>{
        res.json({
            msg:'Se recibio su notificacion',
            response
        })
    });
}
const algoDelete = (req,res = response) =>{
    //res.send('hello World');
    res.json({
        msg:'delete API - Controlador'
    })
}
module.exports = {
    algoGet,
    algoPost,
    algoPut,
    algoDelete,
    notificacionesPost,
    crearCaraPost
}