import { Cart } from "../databasemodels/cart";

export const removeCartItem = async (cartItemId, userId) => {
  try {
    // Get the user's cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    console.log(`#######`, cart);

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.id.toString() === cartItemId
    );

    // If the item is not in the cart, throw an error
    if (itemIndex === -1) {
      throw new Error("Cart item not found");
    }

    // Remove the item from the cart
    cart.items.splice(itemIndex, 1);

    // Recalculate the total price of the cart
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Save the cart
    await cart.save();

    // Return the updated cart
    return await cart.populate("items.product");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to remove item from cart");
  }
};
