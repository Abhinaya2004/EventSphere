import express from 'express'
import eventCltr from '../controllers/event-cltr.js';
import { eventValidationSchema } from '../validations/event-validations.js';
import upload from '../middlewares/Upload.js'
import { checkSchema } from 'express-validator'
import authenticateUser from "../middlewares/authenticateUser.js";
import authorizeUser from "../middlewares/authorizeUser.js";

const router = express.Router();
router.get("/event-types", authenticateUser, eventCltr.getEventTypesByMode);

router.post('/create',upload.fields([
    { name: "images", maxCount: 1 }, // Max 5 images 
  ]),
authenticateUser,
authorizeUser(["host","admin"]),checkSchema(eventValidationSchema),eventCltr.createEvent);

router.get("/",authenticateUser,
  authorizeUser(["host","admin","user"]), eventCltr.getAllEvents);

router.get("/:id", authenticateUser,
    authorizeUser(["host","admin","user"]),eventCltr.getEventById);

router.get("/organiser/:id",authenticateUser,
  authorizeUser(["host"]), eventCltr.getEventsByHost);



export default router;