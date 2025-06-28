const mongoose = require("mongoose")

//  Order Details Schema
const orderDetailSchema = new mongoose.Schema({

    orderDate: { 
        type: Date, required: true 
    },

    orderRefNo: { 
        type: String, required: true, unique: true 
    },

    securityName: { 
        type: String, required: true 
    },

    fundName: { 
        type: String, required: true 
    },

    transactionType: { 
        type: String, enum: ['BUY', 'SELL'], required: true 
    },

    quantity: { 
        type: Number, required: true 
    },

    price: { 
        type: Number, required: true 
    },

    amount: { type: Number, required: true }
});

module.exports = mongoose.model('OrderDetail', orderDetailSchema);