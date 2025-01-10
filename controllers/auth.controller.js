const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

exports.registerController = async (req, res) => {
  try {
    const { email, password, name, phone, role } = req.body;

    if (!name || !phone || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const validRoles = ["Manager", "PantryStaff", "DeliveryPerson"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role`,
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered",
      });
    }

    const user = await User.create({
      name,
      phone,
      email,
      password,
      role,
    });

    // const createdUser = await User.findById(user._id).select("-password");

    // if (!createdUser) {
    //   return res.status(500).json({
    //     success: false,
    //     message: "Error in registration",
    //   });
    // }

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in registration",
      error: error.message,
    });
  }
};

exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email is not registered",
      });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password.",
      });
    }

    const accessToken = await user.generateAccessToken();

    const options = {
      httpOnly: true,
      maxAge: 5 * 24 * 60 * 60 * 1000,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json({
        success: true,
        message: "User login successful",
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          accessToken,
        },
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in login",
      error: error.message,
    });
  }
};

exports.logoutController = async (req, res) => {
  try {
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res.status(200).clearCookie("accessToken", options).json({
      success: true,
      message: "User logged out successfull",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "error in login",
      error: error.message,
    });
  }
};

exports.getRole = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      res.status(404).json({
        success: false,
        message: "Login to continue",
      });
    }
    const data = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!data) {
      res.status(404).json({
        success: false,
        message: "Login to continue",
      });
    }
    res.status(200).json({
      success: true,
      message: "Verified Usesr",
      role: data.role,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "error in getting role",
      error: error.message,
    });
  }
};
