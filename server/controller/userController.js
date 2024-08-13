const UserModel = require("../models/UserModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");

const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const checkEmail = await UserModel.findOne({ email }).select("-password");

    if (!checkEmail) {
      return res.status(400).json({
        message: "user not exit",
        error: true,
      });
    }

    return res.status(200).json({
      message: "email verify",
      status: true,
      data: checkEmail,
    });
  } catch (error) {
    console.log("error in checkEmail", error.message);
    return res.status(500).json({
      message: error.message || error,
      status: true,
    });
  }
};

const checkPassword = async (req, res) => {
  try {
    const { password, userId } = req.body;

    const user = await UserModel.findById(userId);

    const verifyPassword = await bcryptjs.compare(password, user.password);

    if (!verifyPassword) {
      return res.status(400).json({
        message: "Please check password",
        error: true,
      });
    }

    await UserModel.updateOne({ _id: user._id }, { $set: { login: true } });
    const tokenData = {
      id: user._id,
      email: user.email,
    };
    const token = await jwt.sign(tokenData, process.env.JWT_SECRETKEY, {
      expiresIn: "30d",
    });

    return res.status(200).json({
      message: "Login successfully",
      token: token,
      status: true,
    });
  } catch (error) {
    console.log("error in checkPassword", error.message);
    return res.status(500).json({
      message: error.message || error,
      status: true,
    });
  }
};

const logout = async (req, res) => {
  try {
    const id = req.params.Id;
    await UserModel.updateOne({ _id: id }, { $set: { login: false } });
    return res.status(200).json({
      message: "LogOut Successfully!",
      status: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, profile_pic } = req.body;

    const checkEmail = await UserModel.findOne({ email }); //{ name,email}  // null

    if (checkEmail) {
      return res.status(400).json({
        message: "Already user exits",
        status: false,
      });
    }

    //password hashpassword
    const salt = await bcryptjs.genSalt(10);
    const hashpassword = await bcryptjs.hash(password, salt);

    const payload = {
      name,
      email,
      profile: profile_pic,
      password: hashpassword,
    };

    const user = new UserModel(payload);
    const userSave = await user.save();

    return res.status(201).json({
      message: "User created successfully",
      data: userSave,
      status: true,
    });
  } catch (error) {
    console.log("error in registerUser", error.message);
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};

const searchUser = async (req, res) => {
  try {
    const { search } = req.body;

    const query = new RegExp(search, "i", "g");

    const user = await UserModel.find({
      $or: [{ name: query }, { email: query }],
    }).select("-password");

    return res.json({
      message: "all user",
      data: user,
      status: true,
    });
  } catch (error) {
    console.log("error in searchUser", error.message);
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};

const updateUserDetails = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await getUserDetailsFromToken(token);

    const { name, profile_pic } = req.body;

    const updateUser = await UserModel.updateOne(
      { _id: user._id },
      {
        name: name,
        profile: profile_pic,
      }
    );

    const userInfomation = await UserModel.findById(user._id);

    return res.json({
      message: "user update successfully",
      data: userInfomation,
      status: true,
    });
  } catch (error) {
    console.log("error in updateUserDetails", error.message);
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};

const userDetails = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await getUserDetailsFromToken(token);
    return res.status(200).json({
      message: "user details",
      data: user,
      status: true,
    });
  } catch (error) {
    console.log("error in userDetails", error.message);
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};
module.exports = {
  checkEmail,
  logout,
  checkPassword,
  registerUser,
  searchUser,
  userDetails,
  updateUserDetails,
};
