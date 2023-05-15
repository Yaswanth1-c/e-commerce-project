import { Product } from "../databasemodels/product";
import { Cart, CartItem } from "../databasemodels/cart";

export const addToCart = async (productId, quantity, userId) => {
  // Get user cart, or create a new one if it doesn't exist
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId });
  }

  // Find the product by ID to add to the cart
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Invalid product ID");
  }

  // Check if the product is already in the cart
  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );
  if (existingItem) {
    // If the product is already in the cart, update the quantity
    existingItem.quantity += quantity;
  } else {
    // Otherwise, add a new item to the cart
    const newItem = new CartItem({
      product: product.id,
      quantity: quantity,
      price: product.price,
    });
    cart.items.push(newItem);
  }

  // Recalculate the total price of the cart
  cart.totalPrice = cart.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  // Save the cart and return it with the added product
  await cart.save();
  return await cart.populate("items.product");
};
