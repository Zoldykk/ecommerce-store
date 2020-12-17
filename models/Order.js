const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true
    },
    orderedProduct: {
        type: String,
        required: true
    },
    orderStatus: {
        type: String,
        required: true
    }
}, { timestamps: { createdAt: 'created_at' } });

const Orders = mongoose.model('order', orderSchema);

module.exports = Orders;

