const express = require('express');
const router = express.Router();
const multer = require('multer');
const SuperA = require('../middleware/Super')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/super');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null, uniqueSuffix + '-' + file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });
  
const { Register, Login, ForgotPassword, ChangePassword, ProfileUpdate, ProfilePictureUpdate, ViewSuperAdmins, ViewSingleSuperAdmin } = require('../Controllers/Super');
router.post("/register",Register);
// router.post("/register",Register);
// router.post("/check-email?email=:email",EmailCheck);
// router.get("/check-email", EmailCheck);
router.post("/login",Login);
router.post("/forgotPassword",ForgotPassword);
router.put("/changePassword/:id",ChangePassword);
router.get("/ViewSingleSuperAdmin/:id",ViewSingleSuperAdmin);
router.put("/profileUpdate",SuperA,ProfileUpdate);
router.put("/profilePictureUpdate",SuperA,upload.single('profile'),ProfilePictureUpdate);
module.exports = router;