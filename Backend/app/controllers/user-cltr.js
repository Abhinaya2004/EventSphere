import User from "../models/user-model.js";
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import { validationResult } from "express-validator";
import AdditionalDetails from "../models/additionalDetails-model.js";
const userCltr = {}

const generateOtp = ()=>{
    return crypto.randomInt(100000,999999).toString()
}

const otpExpiry = new Date(Date.now() + (5 * 60 * 1000))

userCltr.register = async (req, res) => {
    const Errors = validationResult(req)
    if(!Errors.isEmpty()){
        return res.status(400).json({ errors: Errors.array()[0].msg })
    }
    let body = req.body
    try {
        const salt = await bcrypt.genSalt()
        body.password = await bcrypt.hash(body.password,salt)
        const user=await User.create(body)
        res.status(201).json(user)
    }catch(err){
        console.log(err)
        return res.status(500).json({ errors: 'something went wrong' })
    }
}

userCltr.login = async (req, res) => {
    const Errors = validationResult(req)
    if(!Errors.isEmpty()){
        return res.status(400).json({ errors: Errors.array()[0].msg })
    }
    try {
        const { email, password } = req.body;
        console.log(email,password)
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ errors: "Invalid email, password, or role" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(404).json({ errors: "Invalid email, password, or role" });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.SECRET_KEY,
            { expiresIn: "7d" }
        );
        // console.log(token)
        res.json({ token :`bearer ${token}`, user: { email: user.email, role: user.role } });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ errors: "Something went wrong" });
    }
};

userCltr.requestOtp = async(req,res)=>{
    const Errors = validationResult(req);
    if (!Errors.isEmpty()) {
        return res.status(400).json({ errors: Errors.array() });
    }
    const {email,role} = req.body

    try{
        const user = await User.findOne({email,role})
        if(!user){
            return res.status(404).json({ errors: 'User not found' })
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
        return res.status(500).json({ errors: 'something went wrong' })
    }
}

userCltr.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ errors: "User not found" });
        }

        try{
            const user = await User.findOne({email,role})
            console.log(user)
            console.log(user.otp)

            if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
                return res.status(400).json({ errors: 'Invalid or expired OTP' });
            }

            user.otp = null;
            user.otpExpiry = null;
            await user.save();

            res.json({ message: "OTP verified successfully" });
        } catch (error) {
            return res.status(500).json({ errors: "Something went wrong" });
        }
    } catch (error) {
        return res.status(500).json({ errors: "Something went wrong" });
    }
};

userCltr.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ errors: "User not found" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: "Password reset successfully" });
    } catch (error) {
        return res.status(500).json({ errors: "Something went wrong" });
    }
};

userCltr.account = async (req,res)=>{
    try{
        const {email,password,role,_id} = await User.findById(req.currentUser.userId)
        const additonal = await AdditionalDetails.findById(req.currentUser.userId)
        if(!email){
            return res.status(404).json({ errors: 'User not found' })
        }
        res.json({email,password,role,_id,"additionDetails":additonal?true:false});
    }catch(err){
        console.log(err)
        return res.status(500).json({ errors: 'something went wrong' })
    }
}

userCltr.users = async (req,res)=>{
    try{
        const users = await User.find()
        res.json(users);
    }catch(err){
        console.log(err)
        return res.status(500).json({ errors: 'something went wrong' })
    }
}

export default userCltr