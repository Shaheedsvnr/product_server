const express = require('express');
const router = express.Router();
const multer = require('multer');
const Admins = require('../middleware/Admins')
const Super = require('../middleware/Super')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/admin');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null, uniqueSuffix + '-' + file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });
  
const { Register, EmailCheck, Login, ForgotPassword, ChangePassword, Block, ViewSingleAdmin, ViewAdmins, ProfileUpdate, ProfilePictureUpdate } = require('../Controllers/Admin');
router.post("/register",upload.single('profile'),Register);
// router.post("/register",Register);
// router.post("/check-email?email=:email",EmailCheck);
router.get("/check-email", EmailCheck);
router.post("/login",Login);
router.post("/forgotPassword",ForgotPassword);
router.put("/changePassword/:id",ChangePassword);
// router.put("/block/:id",Super,Block);
router.put("/block/:id",Super,Block);
router.get("/ViewSingleAdmin/:id",ViewSingleAdmin);
router.get("/ViewAdmins",ViewAdmins);
router.put("/profileUpdate",Admins,ProfileUpdate);
router.put("/profilePictureUpdate",Admins,upload.single('profile'),ProfilePictureUpdate);
// router.get("/get",GET);
// router.delete("/delete/:id",Delete);
// router.put("/update/:id",upload.single('image'),Put);
// router.get("/view/:id",View);
module.exports = router;