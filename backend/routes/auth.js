import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

/* User Registration */
router.post("/register", async (req, res) => {
  try {
    /* Create a new user with unhashed password for validation */
    const newuser = new User({
      userType: req.body.userType,
      userFullName: req.body.userFullName,
      admissionId: req.body.admissionId,
      employeeId: req.body.employeeId,
      age: req.body.age,
      dob: req.body.dob,
      gender: req.body.gender,
      address: req.body.address,
      mobileNumber: req.body.mobileNumber,
      email: req.body.email,
      password: req.body.password,
      isAdmin: false,
    });

    /* Run Mongoose schema validation */
    await newuser.validate();

    /* Salting and Hashing the Password */
    const salt = await bcrypt.genSalt(10);
    newuser.password = await bcrypt.hash(req.body.password, salt);

    /* Save User and Return */
    const user = await newuser.save();
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

/* User Login */
router.post("/signin", async (req, res) => {
  try {
    console.log(req.body, "req");
    const user = req.body.admissionId
      ? await User.findOne({
          admissionId: req.body.admissionId,
        })
      : await User.findOne({
          employeeId: req.body.employeeId,
        });

    console.log(user, "user");

    if (!user) {
      return res.status(404).json("User not found");
    }

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
      return res.status(400).json("Wrong Password");
    }

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET || "default_secret", {
      expiresIn: "24h",
    });

    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json({ user: other, token });
  } catch (err) {
    console.log(err);
  }
});

export default router;
