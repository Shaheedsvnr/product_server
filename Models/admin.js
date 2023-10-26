const mongoose = require("mongoose");
const { Schema } = mongoose;
const AdminSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  profile: {
    type:String,
    required: false
  },
  phone: {
    type: Number,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: false,
  },
  status:{
    type: String,
    default:'Active'
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("admin", AdminSchema);
