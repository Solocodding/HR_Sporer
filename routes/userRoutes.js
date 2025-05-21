const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const {searchRoutes,fetchDriverUpdates}=require("../controllers/userController")

router.get("/", verifyToken, (req, res) => {
    res.render("./user/user-dashboard");
});

router.get("/searchCard",verifyToken,(req,res)=>{
    res.render("./user/searchCard");
})

router.post("/searchCard",verifyToken,searchRoutes);
router.post('/fetchDriverUpdates',verifyToken,fetchDriverUpdates); 

module.exports = router;