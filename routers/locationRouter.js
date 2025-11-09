import express from 'express';

const router = express.Router();

import getLocationDataById from '../controllers/locationController/getLocationDataById.js';

router.get('/getLocationDataById/:locationId', getLocationDataById);

export default router;