import User from "../models/user-model.js";

export const userRegisterSchema = {
    email: {
        exists: {
            errorMessage: "Email must be present"
        },
        notEmpty: {
            errorMessage: "Email field cannot be empty"
        },
        isEmail: {
            errorMessage: "Email is not valid"
        },
        trim: true,
        normalizeEmail: true,
        custom: {
            options: async function (value, { req }) {
                try {
                    const role = req.body.role || 'user'; 
                    const user = await User.findOne({ email: value, role });
                    if (user) {
                        throw new Error(`Email is already registered for the role: ${role}`);
                    }
                } catch (err) {
                    throw new Error(err.message);
                }
                return true;
            }
        }
    },
    password: {
        exists: {
            errorMessage: "Password must be present"
        },
        notEmpty: {
            errorMessage: "Password cannot be empty"
        },
        isStrongPassword: {
            options: {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minSymbols: 1,
                minNumbers: 1
            },
            errorMessage: "Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one symbol, and one number"
        },
        trim: true
    }
        
    
}
    
    
export const userLoginSchema={
    email:{
        exists:{
            errorMessage: "email must be present"
        },
        notEmpty:{
            errorMessage: "email field cannot be empty"
        },
        isEmail:{
            errorMessage: "email is not valid"
        },
        trim:true,
        normalizeEmail:true
    },
    password:{
        exists:{
            errorMessage: "password must be present"
        },
        notEmpty:{
            errorMessage:"password cannot be empty"
        },
        isStrongPassword:{
            options:{
                minLength:8,
                minLowerCase:1,
                minUpperCase:1,
                minSymbol:1,
                minNumber:1,
            },
            errorMessage: "password must contain atleast 8 characters including atleast one uppercase,one lowercase,one symbol,one number"
        },
        trim: true
    }
}
