
import express from 'express';
import {addEvents, deleteEventByID, getEventByID, getEvents, updateEventByID} from '../controllers/calendar.controller';

const router = express.Router();

router.post('/addevent', addEvents);
router.post('/getevents', getEvents);
router.get('/event/:eventId', getEventByID);
router.put('/event/:eventId', updateEventByID);
router.delete('/event/:eventId', deleteEventByID);
export default router;