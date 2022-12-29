
const  { Router } = require('express');
const { paypalGet,createPayment,executePayment } = require('../controllers/paypalController')


const router = Router();

router.get('/',paypalGet);
router.post('/create-payment',createPayment);
router.get('/execute-payment',executePayment);

module.exports = router;