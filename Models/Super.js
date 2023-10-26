const mongoose = require("mongoose");
const { Schema } = mongoose;
const SuperAdminSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  profile: {
    default:'null',
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
  created_date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("super", SuperAdminSchema);
