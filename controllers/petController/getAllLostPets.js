import Pet from "../../schemas/petSchema.js";
import HttpError from "../../httpError.js";
import Location from "../../schemas/locationSchema.js";
import ErrorLogMessage from "../../schemas/errorLogMessageSchema.js";

const getAllLostPets = async (req, res, next) => {
  const centerLon = Number(req.params.lon);
  const centerLat = Number(req.params.lat);
  const radiusInMeters = Number(req.params.radius) || 5000; // Default radius 5km
  const earthRadius = 6378137;
  const radiusInRadians = radiusInMeters / earthRadius;


  try {

    const locations = await Location.find({
      location: {
        $geoWithin: {
          $centerSphere: [ [centerLat, centerLon], radiusInRadians ]
        }
      }
    });

    const locationIds = locations.map(loc => loc._id);

    const allLostPets = await Pet.find({
      locationLastSeen: { $in: locationIds }
    }).populate("locationLastSeen");

    if (allLostPets.length > 0) {
  return res.json(allLostPets);
} else {
  const error = new HttpError(
    "No lost pets found, try restarting app",
    404
  );
  return res.json({ msg: error.message });
}
  } catch (err) {
    const error = new HttpError("Could Not retrieve List", 500);
    const errorLog = new ErrorLogMessage({
          message: err.message,
          component: "Get All Lost Pets Controller Backend",
          level: "error",
          timestamp: new Date(),
          notes: null,
          currentSatus: "new",
        });
        await errorLog.save();
    return res.status(500).json({ msg: error.message });
  }
};

export default getAllLostPets;