const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { userDetails, userlogin } = require("../validators/allValidator");
exports.userSignUp = async (req, res) => {
  try {
    let { name, password, address, dob, phone, email, gender } = req.body;
    const { error } = userDetails.validate(req.body);
    if (error) {
      res.status(400).json(error.details[0].message);
      return;
    } else {
      const exist = await userModel.exists({ email: req.body.email });
      if (exist) {
        return res.status(400).send("This email is already taken!");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newuser = new userModel({
        name,
        password,
        address,
        dob,
        phone,
        email,
        gender,
        password: hashedPassword,
      });
      const saveduser = await newuser.save();
      return res.status(200).json({
        status: 1,
        message: "User is Signup sucessfully",
        saveduser,
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: 0,
      message: err.toString(),
    });
  }
};
exports.userLoginEmail = async (req, res) => {
  try {
    const { error } = userlogin.validate(req.body);
    if (error) {
      return res.status(400).json(error.details[0].message);
    } else {
      let userResult = await userModel.findOne({ email: req.body.email });
      if (!userResult) {
        return res.status(404).json({
          status: 0,
          message: "Email Not found",
        });
      }
      if (!req.body.email) {
        return res.send({
          status: false,
          msg: "Email is Required",
          responseResult: [],
        });
      }
      if (!req.body.password) {
        return res.send({ status: false, msg: "Password is Required" });
      } else {
        let passCheck = bcrypt.compareSync(
          req.body.password,
          userResult.password
        );
        if (passCheck == false) {
          return res.status(401).json({
            reponseCode: 401,
            responseMessage: "Incorrect password.",
          });
        } else {
          let dataToken = {
            id: userResult._id,
            isUser: userResult.isUser,
          };
          let token = jwt.sign(dataToken, process.env.JWT_SER, {
            expiresIn: "30d",
          });

          return res.status(200).json({
            status: 1,
            message: "User Login Successfully.....",
            responseResult: userResult,
            token,
          });
        }
      }
    }
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.toString(),
    });
  }
};
exports.userList = async (req, res) => {
  try {
    const data = await userModel.find().select("-password");
    if (!data[0]) {
      return res.status(404).json({
        status: 0,
        message: "No Data",
      });
    } else {
      return res.status(200).json({
        status: 1,
        message: "All List Found..",
        data,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.toString(),
    });
  }
};
exports.userfindbyId = async (req, res) => {
  try {
    const data = await userModel.findById(req.params.id);
    if (!data) {
      return res.status(404).json({
        status: 0,
        message: "Data Not Found..",
      });
    } else {
      return res.status(200).json({
        status: 1,
        message: "Get Data found...",
        data,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.toString(),
    });
  }
};
exports.userEdit = async (req, res) => {
  try {
    const data = req.body;
    const validateKey = [
      "name",
      "phone",
      "email",
      "address",
      "dob",
      "gender",
      "password",
    ];
    for (let key of validateKey) {
      if (!data[key] || data[key] == undefined) {
        return res.status(400).json({
          status: 0,
          message: key + "filed required.",
        });
      }
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      { $set: data, password: hashedPassword },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({
        status: 0,
        message: "Id Not Found....",
      });
    } else {
      return res.status(200).json({
        status: 1,
        message: "Update successfully.....",
        result: updatedUser,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.toString(),
    });
  }
};
exports.userDelete = async (req, res) => {
  try {
    const data = await userModel.findByIdAndDelete(req.params.id);
    if (!data) {
      return res.status(404).json({
        status: 0,
        message: "Data Not Found..",
      });
    } else {
      return res.status(200).json({
        status: 1,
        message: "User data delete..",
        data,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.toString(),
    });
  }
};
