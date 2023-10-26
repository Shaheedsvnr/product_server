const express = require('express');
const router = express.Router();  
const Supervisor = require('../middleware/Super')
const { Insert, View, Delete, Put, ViewSingle, Block } = require('../Controllers/Category');
router.post("/insert",Supervisor,Insert);
router.get("/view",View);
router.put("/block/:id",Supervisor,Block);
router.delete("/delete/:id",Supervisor,Delete);
router.put("/update/:id",Supervisor,Put);
router.get("/viewSingle/:id",ViewSingle);
module.exports = router;