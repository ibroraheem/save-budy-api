const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10);
        const admin = new Admin({ username, email, password: hashedPassword });
        await admin.save();
        const token = jwt.sign({ id: admin._id, username: admin.username}, process.env.JWT_SECRET);
        res.status(201).json({ token: token, username: admin.username });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) throw new Error('Invalid login credentials');
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) throw new Error('Invalid login credentials');
        const token = jwt.sign({ id: admin._id, username: admin.username}, process.env.JWT_SECRET);
        res.status(200).json({ username: admin.username, token: token });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

const forgotPassword = async (req, res) => {
    try{
        const {email} = req.body
        const admin = await Admin.findOne({email})
        if(!admin) throw new Error('Invalid email')
        const resetToken = Math.random() * 1000000
        admin.resetToken = resetToken
        await admin.save()
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset Password',
            html: `<h1>Reset Password</h1>
            <p>Your Password reset otp is <strong style="font-size:3em; color:orange; font-weight:bold;">${resetToken}</strong></p>
            <p>Enter this otp to reset your password</p>`
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if(error) throw new Error(error)
            res.status(200).send('Email sent')
        })
        res.status(200).send('Password Reset OTP sent to your email')
    } catch (error) {
        res.status(500).send({error: error.message})
    }
}

const resetPassword = async (req, res) => {
    try{
        const {email, otp, password} = req.body
        const admin = await Admin.findOne({email})
        if(!admin) throw new Error('Invalid email')
        if(admin.resetToken != otp) throw new Error('Invalid OTP')
        const hashedPassword = bcrypt.hashSync(password, 10);
        admin.password = hashedPassword
        admin.resetToken = null
        await admin.save()
        res.status(200).send('Password reset successfully')
    } catch (error) {
        res.status(500).send({error: error.message})
    }
}

module.exports = {register, login, forgotPassword, resetPassword}