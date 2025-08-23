import  HttpError  from '../../httpError.js';

const getLocation = async (req, res, next) => {
  try {
    const { lat, lon } = req.params;
    console.log(lat)

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
    const error = new HttpError('Error fetching location', 500);
    return res.status(500).json({ error: error.message });
  }
};




  export default getLocation;