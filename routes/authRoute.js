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
router.get('/admin', authController.loginView)
router.post('/', authController.loginPost)
router.get('/dashboard', ensureAuthenticated, authController.dashboardView)
router.get('/products', ensureAuthenticated, authController.dashboardProductsView)
router.get('/orders', ensureAuthenticated, authController.dashboardOrdersView)
router.post('/products', upload.single('image'), authController.dashboardProductsPost)
router.post('/dashboard',(authController.dashboardPost))
router.get('/logout',(authController.logoutGet))

// Website Routes

router.get('/', authController.homepageView)
router.get('/store', authController.storeView)
router.get('/ordinateur-portables', authController.laptopsView)
router.get('/ordinateur-bureaux', authController.desktopsView)
router.get('/accessoires', authController.accessoiresView)
router.get('/products/:id', authController.singleProductView)
router.get('/checkout/:id', authController.checkoutView)
router.get('/checkout-success', authController.checkoutSuccessView)
router.get('/contact', authController.contactView)

// Api Routes
router.get('/api/products', authController.productsGet);
router.get('/api/products/:productId', authController.productsGetById);
router.delete('/api/products', authController.productsDelete);
router.put('/api/products', authController.productsUpdate);
router.get('/api/orders',ensureAuthenticated, authController.ordersGet);
router.get('/api/orders/:orderId',ensureAuthenticated, authController.ordersGetById);
router.post('/api/orders', authController.ordersPost);
router.put('/api/orders', authController.ordersPut);

// 404 endpoint
router.get('*', authController.notFoundView);

module.exports = router
