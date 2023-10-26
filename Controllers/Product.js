const express = require("express");
const ProductdSchema = require("../Models/productSchema");

const Insert = async (req, res) => {
  try {
    const { name, description, price, quantity,category } = req.body;
    const admin = req.admin;
    let image = [];
    for (let x in req.files) {
      // console.log(req.files);
      image.push(req.files[x].filename);
    }
    console.log(image);
    const product = new ProductdSchema({
      seller_id: admin,
      category_id:category,
      name,
      image,
      description,
      price,
      quantity,
    });
    const savedProduct = await product.save();
    let success = true;
    console.log(req.method);
    console.log(savedProduct);
    console.log("------------------------------");
    res.json({ success, savedProduct });
  } catch (error) {
    console.error("Some error occurred " + error);
    res.status(500).json("Some internal error");
  }
};
const GET = async (req, res) => {
  try {
    const product = await ProductdSchema.find({ seller_id: req.admin }).populate('category_id')
    console.log(req.method);
    console.log("------------------------------");
    console.log(product);
    console.log("------------------------------");
    res.json(product);
  } catch (error) {
    console.error("Some error occurred " + error);
    res.status(500).json("Some internal error");
  }
};
const userViewProducts = async (req, res) => {
  try {
    const product = await ProductdSchema.find().populate("category_id").populate("seller_id");
    console.log(req.method);
    console.log("------------------------------");
    console.log(product);
    console.log("------------------------------");
    res.json(product);
  } catch (error) {
    console.error("Some error occurred " + error);
    res.status(500).json("Some internal error");
  }
};
const Delete = async (req, res) => {
  try {
    let product = await ProductdSchema.findById(req.params.id);
    console.log(product);
    // let valid = Object.values(product).includes(product.seller_id == req.admin);
    // console.log(valid);
    if (!product) {
      console.error("Data not found with this ID!");
      return res.status(404).json("Data not found!");
    } else if (!product.seller_id == req.admin) {
      console.error("You are trying to delete someone else's data");
      return res.status(403).json("Forbidden");
    } else {
      product = await ProductdSchema.findByIdAndDelete(req.params.id);
      console.log(req.method);
      console.log("------------------------------");
      console.log("Product deleted successfully...");
      console.log("------------------------------");
      res.json({ Success: "Product deleted successfully", product: product });
    }
  } catch (error) {
    console.error("Some error occurred " + error);
    res.status(500).json("Some internal error");
  }
};
const Put = async (req, res) => {
    const { name, description, price, quantity, category } = req.body;
    let image = [];
  
    // Check if new images are provided in the request
    if (req.files && Object.keys(req.files).length > 0) {
      for (let x in req.files) {
        image.push(req.files[x].filename);
      }
    }
  
    try {
      const newProduct = {};
      if (name) {
        newProduct.name = name;
      }
      if (image.length > 0) { // Only update the image if new images are provided
        newProduct.image = image;
      }
      if (description) {
        newProduct.description = description;
      }
      if (price) {
        newProduct.price = price;
      }
      if (quantity) {
        newProduct.quantity = quantity;
      }
      if (category) {
        newProduct.category_id = category;
      }
  
      let product = await ProductdSchema.findById(req.params.id);
      if (!product) {
        res.status(404).send("Not Found!");
      } else if (!product.seller_id == req.admin) {
        console.error("You are trying to update someone else's data");
        return res.status(403).json("Forbidden");
      } else {
        product = await ProductdSchema.findByIdAndUpdate(
          req.params.id,
          {
            $set: newProduct,
          },
          { new: true }
        );
        res.json({ product, message: "updated successfully" });
        console.log(req.method);
        console.log("---------------------------");
        console.log("Data updated successfully");
        console.log(product);
        console.log("---------------------------");
      }
    } catch (error) {
      console.error("Some error occurred " + error);
      res.status(500).json("Some internal error");
    }
  };
  
const View = async (req, res) => {
  try {
    let product = await ProductdSchema.findById(req.params.id).populate("category_id");
    if (!product) {
      res.status(404).send("NOt Found!");
    }
    console.log(req.method);
    console.log("------------------------------");
    console.log(product);
    console.log("------------------------------");
    res.json({ product });
  } catch (error) {
    console.error("Some error occurred " + error);
    res.status(500).send("Some internal error");
  }
};

module.exports = { Insert, GET, Delete, Put, View,userViewProducts };
