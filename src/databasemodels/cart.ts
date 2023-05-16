import mongoose from "mongoose";

// Define the schema for an item in the cart
const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // reference to the Product model
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

// Define the schema for a cart
const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // reference to the User model
    required: true,
  },
  items: {
    type: [CartItemSchema],
    required: true,
    default: [],
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
});

// Create the Cart and CartItem models from the schemas
const Cart = mongoose.model("Cart", CartSchema);
const CartItem = mongoose.model("CartItem", CartItemSchema);

// Export the models for use in other parts of the application
export { Cart, CartItem };
