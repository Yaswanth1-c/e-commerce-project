import { Order } from "../databasemodels/order";
export const updateOrderStatus = async (id, status) => {
  try {
    // Update the status of the order
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    // If the order is not found, throw an error
    if (!order) {
      throw new Error(`Order with id ${id} not found`);
    }

    // Return the updated order
    return order;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update order");
  }
};
