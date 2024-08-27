const express = require("express");
const { usersModel } = require("../backend/allschemas");
const allroutes = express.Router();
const multer = require("multer");
const upload = multer();
const nodemailer = require('nodemailer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '',
        pass: '',
    }
});

const otpStorage = new Map();

allroutes.get('/', (req, res) => {
    console.log("Reached root");
    res.send("Welcome to the real estate marketplace backend service");
});

allroutes.post('/signUp', upload.none(), async (req, res) => {
    try {
        const existingUser = await usersModel.findOne({ username: req.body.name });
        if (existingUser) {
            return res.status(400).send("Username already exists");
        }

        const newUser = new usersModel({
            username: req.body.name,
            email: req.body.email,
            password: req.body.password
        });

        await newUser.save();
        res.send(newUser);
    } catch (err) {
        console.error("Error while adding user:", err);
        res.status(500).send("Internal Server Error");
    }
});

allroutes.post('/login', upload.none(), async (req, res) => {
    try {
        const user = await usersModel.findOne({ email: req.body.email });
        if (user) {
            if (user.password === req.body.password) {
                res.send(user);
                console.log("Login successful");
            } else {
                res.status(401).send("Invalid credentials");
            }
        } else {
            res.status(401).send("Invalid credentials");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

allroutes.post('/send-otp', upload.none(), async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email address is required' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStorage.set(email, otp);

    const mailOptions = {
        from: 'karrideepakreddy2005@gmail.com',
        to: email,
        subject: 'Your OTP',
        text: `Your OTP is: ${otp}`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

allroutes.post('/verify-otp', upload.none(), (req, res) => {
    const { email, userEnteredOtp } = req.body;
    const storedOtp = otpStorage.get(email);

    if (storedOtp && storedOtp.toString() === userEnteredOtp) {
        res.status(200).json({ message: 'OTP verified successfully' });
    } else {
        res.status(400).json({ error: 'Invalid OTP' });
    }
});

// Add the image classification route
allroutes.post('/classify-image', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const formData = new FormData();
    formData.append('file', fs.createReadStream(req.file.path));

    try {
        const response = await axios.post('http://localhost:5000/predict', formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error calling Flask API:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        fs.unlinkSync(req.file.path); // Remove the file after the request is done
    }
});

module.exports = allroutes;
