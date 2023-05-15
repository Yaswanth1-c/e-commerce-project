import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
});

const Product = mongoose.model("Product", ProductSchema);

export { Product };
