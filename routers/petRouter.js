import express from "express";
import * as petController from "../controllers/petController/petController.js";
const router = express.Router();
import { check } from "express-validator";
import verifyToken from "../verifyJWT.js";
import upload from "../utils/multerConfig.js";
import { uploadPetMainPic, uploadSpottedPet } from "../utils/multerConfig.js";

router.post(
  "/uploadPhotoUser",
  uploadPetMainPic.single("file"),
  ()=>{console.log("called Upload")},
  petController.uploadPhoto
);

router.post(
  "/uploadPhotoSpotted",
  uploadSpottedPet.single("file"),
  petController.uploadPhoto
);

router.post(
  "/newPet",
  //  verifyToken,

  check("petName").notEmpty().isLength({ min: 3 }),
  check("age").isNumeric({ max: 30 }).notEmpty(),
  check("description").notEmpty().isLength({ min: 10 }),
  petController.addNewPet
);

router.get("/getPetsByUserId/:userId", petController.getPetsByUserId);

router.get("/getPetById/:petId", petController.getPetById);

router.get(
  "/getAllLostPets/:lat/:lon/:radius",
  // verifyToken,
  petController.getAllLostPets
);

router.delete(
  "/deletePetById/:petId",
  verifyToken,
  petController.deletePetById
);

router.put(
  "/updatePetById/:petId",
  //  verifyToken,
  petController.updatePetById,
  check("petName").notEmpty().isLength({ min: 3 }),
  check("age").isNumeric().notEmpty(),
  check("description").notEmpty().isLength({ min: 10 })
);

// TEST **************************************************************************
router.get("/getAllUsers", petController.getAllUsers);
router.delete("/deleteAllPets", petController.deleteAllPets);

export default router;
