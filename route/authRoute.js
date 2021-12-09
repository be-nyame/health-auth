const express = require("express");
const { register, login, 
      logout, verifyToken,
       getUser} = require( "../controller/authController");
                                                                

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router
  .route("/user:userId") 
  .get(verifyToken, getUser); // validate user before access

module.exports = router;