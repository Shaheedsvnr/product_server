const express = require("express");
const AdminSchema = require("../Models/admin");
const nodemailer = require("nodemailer");
// const CustomerSchema = require("../Models/customer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "product";
const Register = async (req, res) => {
  console.log(req);
  const { name, phone, email, password, role } = req.body;
  const profile = req.file.filename;
  // console.log(req);

  //   if (role == "seller") {
  let checkEmail = await AdminSchema.findOne({ email: email });
  if (checkEmail) {
    const success = false;
    return res.json({ success, errors: "Email ID already exist" });
  }
  const salt = await bcrypt.genSalt(10);
  const secPass = await bcrypt.hash(password, salt);

  const admin = new AdminSchema({
    name,
    profile,
    phone,
    email,
    password: secPass,
    role,
  });
  const savedAdmin = await admin.save();
  let success = true;
  console.log(req.method);
  console.log(savedAdmin);
  console.log("------------------------------");
  res.json({ success, savedAdmin });
  //   } else {
  //     let checkEmail = await CustomerSchema.findOne({ email: email });
  //     if (checkEmail) {
  //       const success = false;
  //       return res
  //         .status(400)
  //         .json({ success, errors: "Email ID already exist" });
  //     }
  //     const salt = await bcrypt.genSalt(10);
  //     const secPass = await bcrypt.hash(password, salt);

  //     const customer = new CustomerSchema({
  //       name,
  //       profile,
  //       phone,
  //       email,
  //       password: secPass,
  //       role,
  //     });
  //     const savedCustomer = await customer.save();
  //     let success = true;
  //     console.log(req.method);
  //     console.log(savedCustomer);
  //     console.log("------------------------------");
  //     res.json({ success, savedCustomer });
  //   }
};

const EmailCheck =async (req,res) => {
  const email = req.query.email;
  // console.log(email);
  try {
    const existingUser = await AdminSchema.findOne({ email });
    if (existingUser) {
      console.log(email+" Email is already taken!");
      res.json({ isUnique: false });
    } else {
      console.log("You can proceed with this Email!");
      res.json({ isUnique: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred." });
  }
}
const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let admin = await AdminSchema.findOne({ email });
    console.log(admin);
    if (!admin) {
      return res.json({ error: "Invalid credential email" });
    }
    const passwordCompare = await bcrypt.compare(password, admin.password);
    if (!passwordCompare) {
      const success = false;
      return res.json({ success, error: "Invalid credential pass" });
    }
    const data = admin.id;
    console.log(admin.id);
    const authtoken = jwt.sign(data, JWT_SECRET);
    const success = true;
    res.json({ success, authtoken, admin });
  } catch (error) {
    console.error(error.message);
    res.send(" internal some Error occurred");
  }
};
const ForgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    let admin = await AdminSchema.findOne({ email });
    if (!admin) {
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
      text: `Hy ${admin.name}, Your OTP code for login is : ${otp}`,
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
    res.json({ Success: "OTP sent successfully", otp, hashedOTP,admin });
    // Function to generate and hash OTP
  } catch (error) {
    console.error("Some error occurred " + error);
    res.json("Some internal error");
  }
};

const ProfileUpdate = async (req, res) => {
  const { name, phone, email,
    //  password
     } = req.body;
  let token = req.admin;

  console.log(name);
  // const profile = req.file.filename
  try {
    
    const newAdmin = {};
    if (name) {
      newAdmin.name = name;
    }
    // if(profile) {newAdmin.profile = profile};
    if (phone) {
      newAdmin.phone = phone;
    }
    if (email) {
      newAdmin.email = email;
    }
    // if (password) {
    //   const salt = await bcrypt.genSalt(10);
    //   const secPass = await bcrypt.hash(password, salt);
    //   newAdmin.password = secPass;
    // }
    let admin = await AdminSchema.findById(token);
    if (!admin) {
      console.log("Not found!");
      res.status(404).send("Not Found!");
    }
    admin = await AdminSchema.findByIdAndUpdate(
      token,
      {
        $set: newAdmin,
      },
      { new: true }
    );
    res.json({ admin, message: "Profile updated successfully" });
    console.log(req.method);
    console.log("---------------------------");
    console.log("Profile updated successfully");
    console.log(admin);
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
    const newAdmin = {};
    let admin = await AdminSchema.findById(req.params.id);
    if (!admin) {
      res.status(404).send("Not Found!");
    } else {
      if (npassword === repassword) {
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(npassword, salt);
        newAdmin.password = secPass;

        admin = await AdminSchema.findByIdAndUpdate(
          req.params.id,
          {
            $set: newAdmin,
          },
          { new: true }
        );
        let success = true;
        res.json({ admin,success:success, message: "Password changed successfully" });
        console.log(req.method);
        console.log("---------------------------");
        console.log("Password changed successfully");
        console.log(admin);
        console.log("---------------------------");
      } else {
        res.json("Passwords do not match");
      }
    }
  } catch (error) {
    console.error("Some error occurred " + error);
    res.json("Some internal error");
  }
};
const ProfilePictureUpdate = async (req, res) => {
  const profile = req.file.filename;
  const token = req.admin;

  try {
    const newAdmin = {};
    if (profile) {
      newAdmin.profile = profile;
    }
    let admin = await AdminSchema.findById(token);
    if (!admin) {
      console.log("Not found!");
      res.status(404).send("Not Found!");
    }
    admin = await AdminSchema.findByIdAndUpdate(
      token,
      {
        $set: newAdmin,
      },
      { new: true }
    );
    res.json({ admin, message: "Profile Picture updated successfully" });
    console.log(req.method);
    console.log("---------------------------");
    console.log("Profile Picture updated successfully");
    console.log(admin);
    console.log("---------------------------");
  } catch (error) {
    console.error("Some error occurred " + error);
    res.json("Some internal error");
  }
};
const ViewSingleAdmin = async (req, res) => {
  try {
    let admin = await AdminSchema.findById(req.params.id);
    if (!admin) {
      res.status(404).send("NOt Found!");
    }
    console.log(req.method);
    console.log("------------------------------");
    console.log(admin);
    console.log("------------------------------");
    res.json({ admin });
  } catch (error) {
    console.error("Some error occurred " + error);
    res.send("Some internal error");
  }
};
const ViewAdmins = async (req, res) => {
  try {
    let admin = await AdminSchema.find();
    if (!admin) {
      res.status(404).send("No admins found!");
    }
    console.log(req.method);
    console.log("------------------------------");
    console.log(admin);
    console.log("------------------------------");
    res.json({ admin });
  } catch (error) {
    console.error("Some error occurred " + error);
    res.send("Some internal error");
  }
};
const Block = async (req, res) => {
  try {
    let admin = await AdminSchema.findById(req.params.id);
    if (!admin) {
      res.status(404).send("No admins found!");
    }
    
    if (admin.status === "Active") {
      // Set the admin's status to "Inactive" if it's currently "Active"
      admin.status = "Inactive";
      await admin.save(); // Save the updated admin document
      let success = false;
      res.status(200).send({success:success,message : admin.name+" has been blocked successfully.",admin:admin});
    } else {
      admin.status = "Active";
      await admin.save();
      let success = true;
      res.status(200).send({success:success,message : admin.name+" has been Unblocked successfully",admin:admin});
    }
  } catch (error) {
    console.error("Some error occurred " + error);
    res.status(500).send("Some internal error");
  }
};

module.exports = {
  Register,
  EmailCheck,
  Login,
  ForgotPassword,
  ChangePassword,
  ViewSingleAdmin,
  ViewAdmins,
  ProfileUpdate,
  ProfilePictureUpdate,
  Block
};
