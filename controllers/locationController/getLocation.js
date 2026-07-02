import  HttpError  from '../../httpError.js';
import ErrorLogMessage from "../../schemas/errorLogMessageSchema.js";

const getLocation = async (req, res, next) => {
  try {
    const { lat, lon } = req.params;

    if (!lat || !lon) {
      const error = new HttpError('Latitude and longitude are required', 400);
      return res.status(400).json({ error: error.message });

    }

    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

    // Use global fetch in Node 20
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Katie-App (katie5five.5@gmail.com)'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    res.json(data);

  } catch (err) {
   const errorLog = new ErrorLogMessage({
          message: err.message,
          component: "Get Location Controller Backend",
          level: "error",
          timestamp: new Date(),
          notes: null,
          currentSatus: "new",
        });
        await errorLog.save();
        console.log("Error logged in database:", err);
    return res.status(500).json({ error: error.message });
  }
};




  export default getLocation;