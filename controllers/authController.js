const path = require('path');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const bcrypt = require('bcrypt');
const passport = require('passport');
const multer = require('multer');



// Website Handlers
exports.homepage__view = (req, res, next) =>{
    res.render(path.resolve('./views/homepage.ejs'));
}

exports.store__view = async (req, res, next) =>{
    const products = await Product.find();
    res.render(path.resolve('./views/store.ejs'), {
        products: products
    });
}

exports.laptops__view = async (req, res, next) =>{
    const products = await Product.find({ category: 'Ordinateur Portables' } );
    res.render(path.resolve('./views/laptops.ejs'), {
        products: products
    });
}

exports.desktops__view = async (req, res, next) =>{
    const products = await Product.find({ category: 'Ordinateur Bureaux' } );
    res.render(path.resolve('./views/desktops.ejs'), {
        products: products
    });
}

exports.accessoires__view = async (req, res, next) =>{
    const products = await Product.find({ category: 'Accessoires' } );
    res.render(path.resolve('./views/accessoires.ejs'), {
        products: products
    });
}

exports.singleProduct__view = async (req, res, next) =>{
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

exports.checkout__view = async(req, res, next) =>{
    const product = await Product.findById(req.params.id);
    res.render(path.resolve('./views/checkout.ejs'), {
        product: product
    });
}

exports.checkout__success__view = async(req, res, next) =>{
    res.render(path.resolve('./views/checkout-success.ejs'));
}

exports.contact__view = (req, res, next) =>{
    res.render(path.resolve('./views/contact.ejs'));
}

// Api Handlers

exports.products__get = async (req, res, next) =>{
    const products = await Product.find();
    res.json(products)
}

exports.orders__get = async (req, res, next) =>{
    const orders = await Order.find();
    res.json(orders)
}

exports.orders__post = async (req, res, next) =>{
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

exports.orders__put = async (req, res, next) =>{
    const order = await Order.findOneAndUpdate({_id: req.body.id}, 
        {$set: {
            orderStatus: req.body.orderStatus,
        }}, {
            new: true,
            upsert: false
        })

    res.redirect('/orders')    
}

exports.products__getById = async (req, res, next) =>{
    const product = await Product.findById(req.params.productId);
    res.json(product)
}

exports.products__delete = async (req, res) =>{
    const products = await Product.findByIdAndDelete(req.body.id, {useFindAndModify: false});
}

exports.products__update = async (req, res) =>{
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

exports.login__view = (req, res, next) =>{
    res.render(path.resolve('./views/admin-login.ejs'));
}

exports.dashboard__view = async (req, res, next) =>{
    const products = await Product.find();
    const orders = await Order.find();
    res.render('../views/dashboard.ejs', {
        user: req.user,
        products: products,
        orders: orders
    });
}

exports.dashboard__products__view = async (req, res, next) =>{
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

exports.dashboard__orders__view = async (req, res, next) =>{
    const orders = await Order.find();
    res.render('../views/orders.ejs', {
        user: req.user,
        orders: orders
    });
}

exports.orders__getById = async (req, res, next) =>{
    const product = await Order.findById(req.params.orderId);
    res.json(product)
}

exports.dashboard__products__post =  async (req, res, next) =>{
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

exports.login__post = (req, res, next) =>{
    passport.authenticate('local',{
        successRedirect : '/dashboard',
        failureRedirect : '/admin',
        failureFlash : true,
        })(req,res,next);
}


exports.logout__get = (req, res, next) =>{
    req.logout();
    req.flash('success_msg','Now logged out');
    res.redirect('/admin');
}


exports.dashboard__post = async (req, res, next) =>{
    const newPost = await new Post({
        title: req.body.title,
        content: req.body.content,
        category: req.body.category
    });
    res.send('Posted')
    newPost.save()
}

// 404 Handler

exports.notFound__view = (req, res, next) =>{
    res.render(path.resolve('./views/404.ejs'));
}

