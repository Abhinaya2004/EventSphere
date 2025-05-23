import express from 'express'
import userCltr from '../controllers/user-cltr.js'
import { checkSchema } from 'express-validator'
import { userLoginSchema, userRegisterSchema } from '../validations/user-validations.js'
import authenticateUser from '../middlewares/authenticateUser.js'
import authorizeUser from '../middlewares/authorizeUser.js'
const router = express.Router()

router.post('/register',checkSchema(userRegisterSchema),userCltr.register)

router.post('/login',checkSchema(userLoginSchema),userCltr.login)
router.get('/all-users',authenticateUser,authorizeUser(['admin']),userCltr.users)
router.get('/account',authenticateUser,userCltr.account)
router.post('/forgot-password', userCltr.requestOtp);
router.post('/verify-otp', userCltr.verifyOtp);    
router.post('/reset-password', userCltr.resetPassword);
export default router