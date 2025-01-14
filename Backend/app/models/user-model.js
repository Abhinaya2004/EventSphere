import { Schema,model } from "mongoose";

const userSchema = new Schema({
    email: String,
    password:String,
    role:{ type: String, default: 'user', enum: ['user', 'admin', 'host', 'renter'] },
    otp: { type: String }, 
    otpExpiry: { type: Date }
},{timestamps:true})

const User = model('user',userSchema)

export default User