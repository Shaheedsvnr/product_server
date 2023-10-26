const express = require("express");
const CategorySchema = require("../Models/category");

const Insert = async (req, res) => {
  try {
    const { name } = req.body;
    let condition = await CategorySchema.findOne({ name})
    if (condition) {
        console.log("Insertion Failed Category Already Exists");
        console.log("------------------------------------------");
        let success = false;
        return res.json({ success:success, message: "Category already exists" });
    }else{
        const Category = new CategorySchema({
            name,status:"Active"
          });
          const savedCategory = await Category.save();
          let success = true;
          console.log(req.method);
          console.log(savedCategory);
          console.log("------------------------------");
          res.json({ success, savedCategory,message: "Category Inserted successfully" });
    }
  } catch (error) {
    console.error("Some error occurred " + error);
    res.status(500).json("Some internal error");
  }
};
const View = async (req, res) => {
  try {
    const Category = await CategorySchema.find();
    console.log(req.method);
    console.log("------------------------------");
    console.log(Category);
    console.log("------------------------------");
    res.json(Category);
  } catch (error) {
    console.error("Some error occurred " + error);
    res.status(500).json("Some internal error");
  }
};
const Delete = async (req, res) => {
  try {
    let Category = await CategorySchema.findById(req.params.id);
    console.log(Category);
    // let valid = Object.values(Category).includes(Category.seller_id == req.category);
    // console.log(valid);
    if (!Category) {
      console.error("Data not found with this ID!");
      return res.status(404).json("Data not found!");
    } else {
      Category = await CategorySchema.findByIdAndDelete(req.params.id);
      console.log(req.method);
      console.log("------------------------------");
      console.log("Category deleted successfully...");
      console.log("------------------------------");
      res.json({ Success: "Category deleted successfully", Category: Category });
    }
  } catch (error) {
    console.error("Some error occurred " + error);
    res.status(500).json("Some internal error");
  }
};
const Put = async (req, res) => {
  const { name, status } = req.body;
  try {
    const newCategory = {};
    if (name) {
      newCategory.name = name;
    }
    if (status) {
      newCategory.status = status;
    }
    let Category = await CategorySchema.findById(req.params.id);
    if (!Category) {
      res.status(404).send("Not Found!");
    } else {
      Category = await CategorySchema.findByIdAndUpdate(
        req.params.id,
        {
          $set: newCategory,
        },
        { new: true }
      );
      let success=true
      res.json({ success:success, Category, message: "Category updated successful with name "+Category.name });
      console.log(req.method);
      console.log("---------------------------");
      console.log("Data updated successfully");
      console.log(Category);
      console.log("---------------------------");
    }
  } catch (error) {
    console.error("Some error occurred " + error);
    res.status(500).json("Some internal error");
  }
};
const ViewSingle = async (req, res) => {
  try {
    let Category = await CategorySchema.findById(req.params.id);
    if (!Category) {
      res.status(404).send("NOt Found!");
    }
    console.log(req.method);
    console.log("------------------------------");
    console.log(Category);
    console.log("------------------------------");
    res.json({ Category });
  } catch (error) {
    console.error("Some error occurred " + error);
    res.status(500).send("Some internal error");
  }
};
const Block = async (req, res) => {
    try {
      let category = await CategorySchema.findById(req.params.id);
      if (!category) {
        res.status(404).send("No category found!");
      }
      
      if (category.status === "Active") {
        // Set the category's status to "Inactive" if it's currently "Active"
        category.status = "Inactive";
        await category.save();
        let success=false // Save the updated category document
        res.status(200).send({success:success,message : category.name+" has been blocked successfully.",category:category});
      } else {
        category.status = "Active";
        await category.save();
        let success=true
        res.status(200).send({success:success,message : category.name+" has been Unblocked successfully",category:category});
      }
    } catch (error) {
      console.error("Some error occurred " + error);
      res.status(500).send("Some internal error");
    }
  };

module.exports = { Insert, Delete, Put, View,ViewSingle,Block };
