const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const hashedPassword = bcrypt.hashSync(password, 10)
        const user = new User({ username, email, password: hashedPassword })
        await user.save()
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET)
        res.status(201).json({ token: token, username: user.username })
        const verificationToken = Math.random() * 1000000
        user.verificationToken = verificationToken
        await user.save()
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
            subject: 'Verify Email',
            html: `<h1>Verify Email</h1>
            <p>Your Email verification otp is <strong style="font-size:3em; color:orange; font-weight:bold;">${verificationToken}</strong></p>
            <p>Enter this otp to verify your email</p>`
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) throw new Error(error)
            res.status(200).send('Email sent')
        })
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) throw new Error('Invalid login credentials')
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) throw new Error('Invalid login credentials')
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET)
        res.status(200).json({ username: user.username, token: token })
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
}

const verifyEmail = async (req, res) => {
    try {
        const { email, verificationToken } = req.body
        const user = await User.findOne({ email })
        if (!user) throw new Error('Invalid email')
        if (user.verificationToken != verificationToken) throw new Error('Invalid verification token')
        user.verificationToken = null
        user.verified = true
        await user.save()
        res.status(200).send('Email verified')
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
}

const resendVerificationToken = async (req, res) => {
    try{
        const Token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(Token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded.id })
        if (!user) throw new Error('Invalid email')
        const verificationToken = Math.random() * 1000000
        user.verificationToken = verificationToken
        await user.save()
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
            to: user.email,
            subject: 'Verify Email',
            html: `<h1>Verify Email</h1>
            <p>Your Email verification otp is <strong style="font-size:3em; color:orange; font-weight:bold;">${verificationToken}</strong></p>
            <p>Enter this otp to verify your email</p>`
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) throw new Error(error)
            res.status(200).send('Email sent')
        })
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) throw new Error('Invalid email')
        const resetToken = Math.random() * 1000000
        user.resetToken = resetToken
        await user.save()
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
            <p>Your password reset otp is <strong style="font-size:3em; color:orange; font-weight:bold;">${resetToken}</strong></p>
            <p>Enter this otp to reset your password</p>`
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) throw new Error(error)
            res.status(200).send('Email sent')
        })
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
}

const resendPasswordToken = async (req, res) => {
    try{
        const Token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(Token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded.id })
        if (!user) throw new Error('Invalid email')
        const resetToken = Math.random() * 1000000
        user.resetToken = resetToken
        await user.save()
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
            to: user.email,
            subject: 'Reset Password',
            html: `<h1>Reset Password</h1>
            <p>Your password reset otp is <strong style="font-size:3em; color:orange; font-weight:bold;">${resetToken}</strong></p>
            <p>Enter this otp to reset your password</p>`
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) throw new Error(error)
            res.status(200).send('Email sent')
        })
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { email, resetToken, newPassword } = req.body
        const user = await User.findOne({ email })
        if (!user) throw new Error('Invalid email')
        if (user.resetToken != resetToken) throw new Error('Invalid reset token')
        const hashedPassword = bcrypt.hashSync(newPassword, 10)
        user.password = hashedPassword
        user.resetToken = null
        await user.save()
        res.status(200).send('Password reset')
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
}

module.exports = { register, login, verifyEmail, forgotPassword, resetPassword, resendPasswordToken, resendVerificationToken }