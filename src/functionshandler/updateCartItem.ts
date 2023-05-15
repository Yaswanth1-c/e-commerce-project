import { Cart, CartItem } from "../databasemodels/cart";
export const updateCartItem = async (cartItemId, quantity, userId) => {
  // Get the user's cart and populate it with product data
  const cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart) {
    throw new Error("Cart not found");
  }

  // Find the cart item to update
  const cartItem = cart.items.find((item) => item.id === cartItemId);
  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  // Update the cart item quantity
  cartItem.quantity = quantity;

  // Recalculate the total price of the cart
  cart.totalPrice = cart.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  // Save the cart and return the updated cart item
  await cart.save();
  return cart.populate("items.product");
};
