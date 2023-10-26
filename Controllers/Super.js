const express = require("express");
const SuperAdminSchema = require("../Models/Super");
const nodemailer = require("nodemailer");
// const CustomerSchema = require("../Models/customer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "product";
const Register = async (req, res) => {
  const { name, phone, email, password, role } = req.body;
  //   const profile = req.file.filename;
  const conditions = await SuperAdminSchema.findOne({ email });
  if (conditions) {
    return res.status(409).send("Email already exists");
  } else {
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(password, salt);
    let superA = new SuperAdminSchema({
      name,
      phone,
      email,
      role,
      password: secPass,
    });
    const savedsuper = await superA.save();
    let success = true;
    console.log(req.method);
    console.log(savedsuper);
    console.log("------------------------------");
    res.json({ success, savedsuper });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let superA = await SuperAdminSchema.findOne({ email });
    console.log(superA);
    if (!superA) {
      return res.json({ error: "Invalid credential email" });
    }
    const passwordCompare = await bcrypt.compare(password, superA.password);
    if (!passwordCompare) {
      const success = false;
      return res.json({ success, error: "Invalid credential pass" });
    }
    const data = superA.id;
    console.log(superA.id);
    const authtoken = jwt.sign(data, JWT_SECRET);
    const success = true;
    res.json({ success, authtoken, superA });
  } catch (error) {
    console.error(error.message);
    res.send(" internal some Error occurred");
  }
};
const ForgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    let superA = await SuperAdminSchema.findOne({ email });
    if (!superA) {
      console.error("Email does not exists!");
      return res.json("Email does not exists!");
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Hash the OTP
    const saltRounds = 10; // You can adjust the number of salt rounds
    const hashedOTP = await bcrypt.hash(otp, saltRounds);
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Use your email service provider
      auth: {
        user: "shaheedsvnr@gmail.com", // Replace with your email address
        pass: "eoft kydd dmsc fytp", // Replace with your email password
      },
    });

    const mailOptions = {
      from: "Your Name <shaheedsvnr@gmail.com>",
      to: email,
      subject: "Your OTP Code",
      text: `Hy ${superA.name}, Your OTP code for login is : ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending OTP:", error);
        return res.status(500).json({ message: "Failed to send OTP" });
      } else {
        console.log("OTP sent:", info.response);
        return res
          .status(200)
          .json({ message: "OTP sent successfully", otp: otp });
      }
    });
    console.log(req.method);
    console.log("------------------------------");
    console.log("OTP sent successfully...");
    console.log("------------------------------");
    res.json({ Success: "OTP sent successfully", otp, hashedOTP, superA });
    // Function to generate and hash OTP
  } catch (error) {
    console.error("Some error occurred " + error);
    res.json("Some internal error");
  }
};
const ViewSingleSuperAdmin = async (req, res) => {
    try {
      let superA = await SuperAdminSchema.findById(req.params.id);
      if (!superA) {
        return res.status(404).send("NOt Found!");
      }
      console.log(req.method);
      console.log("------------------------------");
      console.log(superA);
      console.log("------------------------------");
      res.json({ superA });
    } catch (error) {
      console.error("Some error occurred " + error);
      res.send("Some internal error");
    }
  };
  const ViewSuperAdmins = async (req, res) => {
    try {
      let superA = await SuperAdminSchema.find();
      if (!superA) {
        res.status(404).send("No admins found!");
      }
      console.log(req.method);
      console.log("------------------------------");
      console.log(superA);
      console.log("------------------------------");
      res.json({ superA });
    } catch (error) {
      console.error("Some error occurred " + error);
      res.send("Some internal error");
    }
  };
const ProfileUpdate = async (req, res) => {
  const { name, phone, email } = req.body;
  let token = req.superA;

  //   console.log(name);
  // const profile = req.file.filename
  try {
    const newsuper = {};
    if (name) {
      newsuper.name = name;
    }
    // if(profile) {newsuper.profile = profile};
    if (phone) {
      newsuper.phone = phone;
    }
    if (email) {
      newsuper.email = email;
    }
    // if (password) {
    //   const salt = await bcrypt.genSalt(10);
    //   const secPass = await bcrypt.hash(password, salt);
    //   newsuper.password = secPass;
    // }
    let superA = await SuperAdminSchema.findById(token);
    if (!superA) {
      console.log("Not found!");
      res.status(404).send("Not Found!");
    }
    superA = await SuperAdminSchema.findByIdAndUpdate(
      token,
      {
        $set: newsuper,
      },
      { new: true }
    );
    res.json({ superA, message: "Profile updated successfully" });
    console.log(req.method);
    console.log("---------------------------");
    console.log("Profile updated successfully");
    console.log(superA);
    console.log("---------------------------");
  } catch (error) {
    console.error("Some error occurred " + error);
    res.json("Some internal error");
  }
};
const ChangePassword = async (req, res) => {
  const { npassword, repassword } = req.body;
  // const profile = req.file.filename
  try {
    const newsuper = {};
    let superA = await SuperAdminSchema.findById(req.params.id);
    if (!superA) {
      res.status(404).send("Not Found!");
    } else {
      if (npassword === repassword) {
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(npassword, salt);
        newsuper.password = secPass;

        superA = await SuperAdminSchema.findByIdAndUpdate(
          req.params.id,
          {
            $set: newsuper,
          },
          { new: true }
        );
        let success = true;
        res.json({
          superA,
          success: success,
          message: "Password updated successfully",
        });
        console.log(req.method);
        console.log("---------------------------");
        console.log("Password changed successfully");
        console.log(superA);
        console.log("---------------------------");
      } else {
        res.json({message:"Password updating unsuccessful, Please try again"});
      }
    }
  } catch (error) {
    console.error("Some error occurred " + error);
    res.json("Some internal error");
  }
};
const ProfilePictureUpdate = async (req, res) => {
  const profile = req.file.filename;
  let token = req.superA;

  try {
    const newsuper = {};
    if (profile) {
      newsuper.profile = profile;
    }
    let superA = await SuperAdminSchema.findById(token);
    if (!superA) {
      console.log("Not found!");
      res.status(404).send("Not Found!");
    }
    superA = await SuperAdminSchema.findByIdAndUpdate(
      token,
      {
        $set: newsuper,
      },
      { new: true }
    );
    res.json({ superA, message: "Profile Picture updated successfully" });
    console.log(req.method);
    console.log("---------------------------");
    console.log("Profile Picture updated successfully");
    console.log(superA);
    console.log("---------------------------");
  } catch (error) {
    console.error("Some error occurred " + error);
    res.json("Some internal error");
  }
};

module.exports = {
  Register,
  //   EmailCheck,
  Login,
  ViewSuperAdmins,
  ViewSingleSuperAdmin,
  ForgotPassword,
  ChangePassword,
  //   ViewSinglesuper,
  ProfileUpdate,
  ProfilePictureUpdate,
};
