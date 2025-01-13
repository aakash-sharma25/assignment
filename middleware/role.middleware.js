const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.isManager = async (req, res, next) => {
  try {
    const token =
      (await req.cookies?.accessToken) ||
      req.header("Authorization")?.replace("Bearer ", "");
    console.log("the token is ", token);

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "token is missing",
      });
    }

    const decodedToken = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    console.log(decodedToken)
    if (decodedToken.role !== "Manager") {
      return res.status(404).json({
        success: false,
        message: "Protected route for admin",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: true,
      message: "invalid token",
    });
  }
};

exports.isPantryStaff = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "token is missing",
      });
    }

    const decodedToken = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    if (
      decodedToken.role !== "PantryStaff" ||
      decodedToken.role !== "DeliveryPerson"
    ) {
      return res.status(404).json({
        success: false,
        message: "Protected route for Vendor",
        decodedToken,
      });
    }
    req.body.vendorId = decodedToken._id;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: true,
      message: "invalid token",
    });
  }
};
