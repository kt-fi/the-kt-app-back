import express from 'express';
import * as notificationsController from '../controllers/notificationsController/notificationsController.js';

const router = express.Router();

router.post('/setDeviceToken', notificationsController.setDeviceToken);

export default router;