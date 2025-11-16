import HttpError from "../../httpError.js";
import Location from "../../schemas/locationSchema.js";

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
    let error = new HttpError("Fetching location data failed, please try again later.", 500);
    res.json({ msg: error.message });
    return next(err);
  }
  
};

export default getLocationDataById;
