import Pet from "../../schemas/petSchema.js";
import HttpError from "../../httpError.js";


const getAllLostPets = async (req, res, next) => {
  let allLostPets;
  try {
    allLostPets = (await Pet.find({ status: "missing" }).populate("locationLastSeen"))

    if (allLostPets.length === 0) {
      const error = new HttpError(
        "No lost pets found, try restarting app",
        404
      );
      res.json({ msg: error.message });
      return next(error);
    }
  } catch (err) {
    const error = new HttpError("Could Not retreive List", 500);
    res.json({ msg: error.message });
    return next(error);
  }
  return res.json(allLostPets);
};


export default getAllLostPets;