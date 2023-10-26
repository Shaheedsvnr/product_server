const mongoose = require("mongoose");
const { Schema } = mongoose;
const CategorySchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("category", CategorySchema);
