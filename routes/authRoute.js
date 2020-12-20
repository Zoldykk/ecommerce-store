const express = require('express');
const path = require('path');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');
const {ensureAuthenticated} = require("../config/auth.js")
const multer = require('multer');


// Mutler Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './views/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({storage: storage, fileFilter: fileFilter});



//Dashboard Routes
router.get('/admin', authController.login__view)
router.post('/', authController.login__post)
router.get('/dashboard', ensureAuthenticated, authController.dashboard__view)
router.get('/products', ensureAuthenticated, authController.dashboard__products__view)
router.get('/orders', ensureAuthenticated, authController.dashboard__orders__view)
router.post('/products', upload.single('image'), authController.dashboard__products__post)
router.post('/dashboard',(authController.dashboard__post))
router.get('/logout',(authController.logout__get))

// Website Routes

router.get('/', authController.homepage__view)
router.get('/store', authController.store__view)
router.get('/ordinateur-portables', authController.laptops__view)
router.get('/ordinateur-bureaux', authController.desktops__view)
router.get('/accessoires', authController.accessoires__view)
router.get('/products/:id', authController.singleProduct__view)
router.get('/checkout/:id', authController.checkout__view)
router.get('/checkout-success', authController.checkout__success__view)
router.get('/contact', authController.contact__view)

// Api Routes
router.get('/api/products', authController.products__get);
router.get('/api/products/:productId', authController.products__getById);
router.delete('/api/products', authController.products__delete);
router.put('/api/products', authController.products__update);
<<<<<<< HEAD
router.get('/api/orders',ensureAuthenticated, authController.orders__get);
router.get('/api/orders/:orderId',ensureAuthenticated, authController.orders__getById);
=======
router.get('/api/orders', ensureAuthenticated, authController.orders__get);
router.get('/api/orders/:orderId', ensureAuthenticated, authController.orders__getById);
>>>>>>> 9c3fefd321197dca940fe44bca25c07153816efe
router.post('/api/orders', authController.orders__post);
router.put('/api/orders', authController.orders__put);

// 404 endpoint
router.get('*', authController.notFound__view);

module.exports = router
