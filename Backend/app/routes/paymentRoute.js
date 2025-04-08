import paymentCltr from "../controllers/payment-cltr.js";
import express from 'express'
const router = express.Router()
import authenticateUser from "../middlewares/authenticateUser.js";


router.post('/payment/create-checkout-session',authenticateUser,paymentCltr.pay)
router.patch("/payment/update-status/:sessionId", authenticateUser, paymentCltr.updateStatus);

// New routes for fetching payments
router.get('/payment/venue', authenticateUser, paymentCltr.getVenuePayments);
router.get('/payment/event', authenticateUser, paymentCltr.getEventPayments);
router.get('/payment/:paymentId', authenticateUser, paymentCltr.getPaymentById);
router.get('/payment/venue-payments/:venueId',authenticateUser, paymentCltr.getPaymentByVenueID);

// Admin route for all successful payments
router.get('/payment/admin/successful-payments', authenticateUser, paymentCltr.getAllSuccessfulPayments);

export default router