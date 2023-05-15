import mongoose from "mongoose";

// Define the order schema
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // Specify the data type as ObjectId
    ref: "User", // Reference the "User" model
    required: true,
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["placed", "processing", "shipped", "delivered"], // Define allowed values for the status
    default: "placed", // Default status is "placed"
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

// Create the Order model using the schema
const Order = mongoose.model("Order", orderSchema);

// Export the Order model for use in other modules
export { Order };
