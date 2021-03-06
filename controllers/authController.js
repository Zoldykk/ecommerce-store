const path = require('path');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const bcrypt = require('bcrypt');
const passport = require('passport');
const multer = require('multer');



// Website Handlers
exports.homepageView = (req, res, next) =>{
    res.render(path.resolve('./views/homepage.ejs'));
}

exports.storeView = async (req, res, next) =>{
    const products = await Product.find();
    res.render(path.resolve('./views/store.ejs'), {
        products: products
    });
}

exports.laptopsView = async (req, res, next) =>{
    const products = await Product.find({ category: 'Ordinateur Portables' } );
    res.render(path.resolve('./views/laptops.ejs'), {
        products: products
    });
}

exports.desktopsView = async (req, res, next) =>{
    const products = await Product.find({ category: 'Ordinateur Bureaux' } );
    res.render(path.resolve('./views/desktops.ejs'), {
        products: products
    });
}

exports.accessoiresView = async (req, res, next) =>{
    const products = await Product.find({ category: 'Accessoires' } );
    res.render(path.resolve('./views/accessoires.ejs'), {
        products: products
    });
}

exports.singleProductView = async (req, res, next) =>{
    const products = await Product.findById(req.params.id);

    Product.find({ category: products.category, _id: { $ne: products._id } })
        .limit(4)
        .exec(function(err, relatedProducts) {
            res.render(path.resolve('./views/product-page.ejs'), {
                products: products,
                relatedProducts: relatedProducts
            });
        }
    );
}

exports.checkoutView = async(req, res, next) =>{
    const product = await Product.findById(req.params.id);
    res.render(path.resolve('./views/checkout.ejs'), {
        product: product
    });
}

exports.checkoutSuccessView = async(req, res, next) =>{
    res.render(path.resolve('./views/checkout-success.ejs'));
}

exports.contactView = (req, res, next) =>{
    res.render(path.resolve('./views/contact.ejs'));
}

// Api Handlers

exports.productsGet = async (req, res, next) =>{
    const products = await Product.find();
    res.json(products)
}

exports.ordersGet = async (req, res, next) =>{
    const orders = await Order.find();
    res.json(orders)
}

exports.ordersPost = async (req, res, next) =>{
    const newOrder = await new Order({
        name: req.body.name,
        city: req.body.city,
        phone: req.body.phone,
        orderedProduct: req.body.product_id,
        orderStatus: 'Pending'
    });
    newOrder.save();
    res.render(path.resolve('./views/checkout-success.ejs'));
}

exports.ordersPut = async (req, res, next) =>{
    const order = await Order.findOneAndUpdate({_id: req.body.id}, 
        {$set: {
            orderStatus: req.body.orderStatus,
        }}, {
            new: true,
            upsert: false
        })

    res.redirect('/orders')    
}

exports.productsGetById = async (req, res, next) =>{
    const product = await Product.findById(req.params.productId);
    res.json(product)
}

exports.productsDelete = async (req, res) =>{
    const products = await Product.findByIdAndDelete(req.body.id, {useFindAndModify: false});
}

exports.productsUpdate = async (req, res) =>{
    const product = await Product.findOneAndUpdate({_id: req.body.id}, 
        {$set: {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category
        }}, {
            new: true,
            upsert: false
          })
    res.redirect('/products') 
}

// Dashboard Handlers

exports.loginView = (req, res, next) =>{
    res.render(path.resolve('./views/admin-login.ejs'));
}

exports.dashboardView = async (req, res, next) =>{
    const products = await Product.find();
    const orders = await Order.find().sort({ _id: -1 }).limit(6);
    res.render('../views/dashboard.ejs', {
        user: req.user,
        products: products,
        orders: orders
    });
}

exports.dashboardProductsView = async (req, res, next) =>{
    Product.find()
        .then((result) =>{
            res.render('../views/products.ejs', {
                    user: req.user,
                    products: result
                });
        })
        .catch(err =>{
            console.log(err)
        })
}

exports.dashboardOrdersView = async (req, res, next) =>{
    const orders = await Order.find().sort({ _id: -1 });
    res.render('../views/orders.ejs', {
        user: req.user,
        orders: orders
    });
}

exports.ordersGetById = async (req, res, next) =>{
    const product = await Order.findById(req.params.orderId);
    res.json(product)
}

exports.dashboardProductsPost =  async (req, res, next) =>{
    const newProduct = await new Product({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: req.file.filename
    });
    newProduct.save();
    res.redirect('/products')
};

exports.loginPost = (req, res, next) =>{
    passport.authenticate('local',{
        successRedirect : '/dashboard',
        failureRedirect : '/admin',
        failureFlash : true,
        })(req,res,next);
}


exports.logoutGet = (req, res, next) =>{
    req.logout();
    req.flash('success_msg','Now logged out');
    res.redirect('/admin');
}


exports.dashboardPost = async (req, res, next) =>{
    const newPost = await new Post({
        title: req.body.title,
        content: req.body.content,
        category: req.body.category
    });
    res.send('Posted')
    newPost.save()
}

// 404 Handler

exports.notFoundView = (req, res, next) =>{
    res.render(path.resolve('./views/404.ejs'));
}

