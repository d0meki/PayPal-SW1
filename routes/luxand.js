const  { Router } = require('express');
const { algoGet,algoPut,algoPost,algoDelete,notificacionesPost,crearCaraPost} = require('../controllers/luxandController');

const router = Router();

router.get('/',algoGet);
router.put('/:id',algoPut );
router.post('/',algoPost);
router.post('/createface',crearCaraPost);
router.post('/notification',notificacionesPost);
router.delete('/',algoDelete);


module.exports = router;