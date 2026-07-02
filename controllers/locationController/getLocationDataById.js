import HttpError from "../../httpError.js";
import Location from "../../schemas/locationSchema.js";
import ErrorLogMessage from "../../schemas/errorLogMessageSchema.js";

const getLocationDataById = async (req, res, next) => {

  const locationId = req.params.locationId;


  
  let locationData;

  try {

    if(!locationId || locationId == undefined || locationId == null){
      throw new HttpError("Location ID is required", 400);
    }

    locationData = await Location.findById(locationId);
    if (!locationData) {
      throw new HttpError("Location not found", 404);
    }
    res.json(locationData );
    
  } catch (err) {
    const errorLog = new ErrorLogMessage({
          message: err.message,
          component: "Get Location Data By ID Controller Backend",
          level: "error",
          timestamp: new Date(),
          notes: null,
          currentSatus: "new",
        });
        await errorLog.save();
    let error = new HttpError("Fetching location data failed, please try again later.", 500);
    res.json({ msg: error.message });
    return next(err);
  }
  
};

export default getLocationDataById;
