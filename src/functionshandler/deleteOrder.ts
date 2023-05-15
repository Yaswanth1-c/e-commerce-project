import { Order } from "../databasemodels/order";
export const updateOrderStatus = async (_: unknown, { id }: { id: string }) => {
  try {
    // Find and delete the order with the specified id
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      throw new Error(`Order with id ${id} not found`);
    }
    return {
      message: "Order deleted successfully",
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete order");
  }
};
