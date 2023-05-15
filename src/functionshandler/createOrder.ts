import { Cart } from "../databasemodels/cart";
import { Order } from "../databasemodels/order";

export const createOrder = async (items, status, user) => {
  try {
    if (!user || !user.id) {
      throw new Error("Invalid user");
    }

    // Get the user's cart
    const cart = await Cart.findOne({ user: user.id }).populate(
      "items.product"
    );

    console.log(cart);
    if (!cart) {
      throw new Error("Cart not found");
    }
    const orderItems = cart.items.map((item) => item.id);
    // create the new order
    const order = new Order({
      items: orderItems,
      user,
      status,
      totalPrice: cart.totalPrice,
      createdAt: new Date().toISOString(),
    });

    // save the order in the database
    await order.save();
    // Clear the user's cart by deleting all items
    cart.items.splice(0, cart.items.length);
    cart.totalPrice = 0;
    await cart.save();

    return await order.populate("user items.product");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create order");
  }
};
