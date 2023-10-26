const express = require('express');
const router = express.Router();
const multer = require('multer');
const Admins = require('../middleware/Admins')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/product');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null, uniqueSuffix + '-' + file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });
  
const { Insert, GET, Delete, Put, View,userViewProducts } = require('../Controllers/Product');
router.post("/insert",Admins,upload.array('image'),Insert);
router.get("/get",Admins,GET);
router.get("/userViewProducts",userViewProducts);
router.delete("/delete/:id",Admins,Delete);
router.put("/update/:id",Admins,upload.array('image'),Put);
router.get("/view/:id",View);
module.exports = router;