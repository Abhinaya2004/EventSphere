import User from "../models/user-model.js";
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import { validationResult } from "express-validator";
const userCltr = {}

const generateOtp = ()=>{
    return crypto.randomInt(100000,999999).toString()
}

const otpExpiry = new Date(Date.now() + (5 * 60 * 1000))

userCltr.register = async(req,res)=>{
    const Errors = validationResult(req)
    if(!Errors.isEmpty()){
        return res.status(400).json(Errors.array())
    }
    const body = req.body
    try{
        const salt =await bcrypt.genSalt()
        body.password =await bcrypt.hash(body.password,salt)

        const user=await User.create(body)
        res.status(201).json(user)
    }catch(err){
        console.log(err)
        return res.status(500).json({error:'something went wrong'})
    }
}

userCltr.login = async(req,res)=>{
    const Errors = validationResult(req)
    if(!Errors.isEmpty()){
        return res.status(400).json(Errors.array())
    }
    const {email,password} = req.body
    try{
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({error:'invalid email/password'})
        }

        const isVerified = await bcrypt.compare(password,user.password)
        if(!isVerified){
            return res.status(404).json({error:'invalid email/password'})
        }

        const tokenData = {userId : user._id, role : user.role} 
        const token = jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn: '7d'})

        res.json({token:`Bearer ${token}`})
    }catch(err){
        console.log(err)
        return res.status(500).json('something went wrong')
    }
}

userCltr.requestOtp = async(req,res)=>{
    const {email} = req.body

    try{
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({ error: 'Email not found' })
        }

        user.otp = generateOtp()
        user.otpExpiry = otpExpiry

        await user.save()

        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
              user: process.env.EMAIL,
              pass: process.env.EMAIL_PASSWORD,
            },
          });
      
          await transporter.sendMail({
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Your OTP is ${user.otp}. It will expire in 5 minutes.`,
          });
      
          res.status(200).json({ message: 'OTP sent to email' });
    }catch(err){
        console.log(err)
        return res.status(500).json({error:'something went wrong'})
    }
}

userCltr.verifyOtp = async(req,res)=>{
    const {email,otp} = req.body

    try{
        const user = await User.findOne({email})

        if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        user.otp = null
        user.otpExpiry = null
        await user.save();

        res.status(200).json({ message: 'OTP verified successfully' });

    }catch(err){
        console.log(err)
        return res.status(500).json({error:'something went wrong'})
    }
}

userCltr.resetPassword = async(req,res)=>{
    const {email,newPassword} = req.body
    try{
        const user = User.findOne({email})
        if(!user){
            return res.status(404).json({ error: 'Email not found' })
        }

        const hashedPassword =await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        await user.save()

        res.status(200).json({ message: 'Password reset successfully' });
    }catch(err){
        console.log(err)
        return res.status(500).json({error:'something went wrong'})
    }
}

export default userCltr