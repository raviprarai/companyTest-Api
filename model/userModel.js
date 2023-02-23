const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userModelSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
    },
    dob: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isUser: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
const userModel = mongoose.model("userModel", userModelSchema);
module.exports = userModel;
