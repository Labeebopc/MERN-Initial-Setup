const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
// const { generateToken } = require("../auth-token/jwt-token.js");
const Test = require('../models/testModel')
const axios = require("axios")


//@disc Test Registration
//@api POST /tests
//@access Public
exports.testRegistration = asyncHandler(async (req, res) => {

    const { name, email, phone } = req.body;

    try {

        if (!name || !email || !phone) {
            return res.status(400).json({ error: 'Required field is missing !' });
        }

        const existingTest = await Test.findOne({ email: email });
        if (existingTest) {
            return res
                .status(400)
                .json({ status: false, message: "Test already exists" });
        }

        if (!existingTest) {

            const test = await Test.create({ name, email, phone});

            return res
                .status(201)
                .json({ status: true, test, message: "Test successfully created" });
        }
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message });
    }
});