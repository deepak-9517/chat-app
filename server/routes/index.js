const express = require("express");
const {
  registerUser,
  checkEmail,
  checkPassword,
  userDetails,
  logout,
  updateUserDetails,
  searchUser,
} = require("../controller/userController");

const router = express.Router();

router.post("/user/register", registerUser);
router.post("/user/check-email", checkEmail);
router.post("/user/check-password", checkPassword);
router.get("/user/user-detail", userDetails);
router.get("/user/logout/:Id", logout);
router.post("/user/update-detail", updateUserDetails);
router.post("/user/search", searchUser);

module.exports = router;
