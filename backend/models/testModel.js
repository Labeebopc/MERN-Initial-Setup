const mongoose = require("mongoose")

// Lead Schema
const testSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"]
    },

    email: {
        type: String,
        required: [true, "Please enter your email"]
    },

    phone: {
        type: String,
        required: [true, "Please enter your phone"]
    },

    isActive: {
        type: Boolean, default: true
    }

}, { timestamps: true })

const testModel = mongoose.model("Test", testSchema)

module.exports = testModel;