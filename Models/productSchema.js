const mongoose = require("mongoose");
const { Schema } = mongoose;
const ProductdSchema = new Schema({
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  },
  name: {
    type: String,
    required: false,
  },
  image: [
    {
      type: String,
      required: false,
    },
  ],
  description: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: false,
  },
  quantity: {
    type: Number,
    required: false,
  },
});
module.exports = mongoose.model("product", ProductdSchema);
