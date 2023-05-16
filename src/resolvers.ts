// Import necessary models and packages
import { Order } from "./databasemodels/order";
import { User } from "./databasemodels/user";
import { Product } from "./databasemodels/product";
import { Cart, CartItem } from "./databasemodels/cart";

export const stripe = require("stripe")(
  "sk_test_51MxUhMSJZw37cboEifpinxY9EjrkkJEOrhLSw7Wwtx5VCOp73W9FiJc0kIwb3xmKkWutRQrQtaCCZS3WOHpQeDHP004TCopGAI",
  {
    apiVersion: "2022-11-15",
  }
);
import { addToCart } from "./functionshandler/addToCart";
import { updateCartItem } from "./functionshandler/updateCartItem";
import { removeCartItem } from "./functionshandler/removeCartItem";
import { createOrder } from "./functionshandler/createOrder";
import { createUser } from "./functionshandler/signUp";

import jwt from "jsonwebtoken";
// Hash the password using bcrypt
import bcrypt from "bcrypt";
// Import necessary input types from schema file
import { ProductInput, UpdateProductInput } from "./schema";

// Set JWT_SECRET for authentication
const JWT_SECRET = "secret";

// Define resolvers
export const resolvers = {
  Query: {
    // Query to retrieve all products
    products: async (_: unknown, { limit , offset }) => {
      const products = await Product.find().limit(limit).skip(offset);
      return products;
    },

    // Query to retrieve all carts
    cart: async () => {
      const cart = await Cart.find().populate("user items.product");
      return cart;
    },

    // Query to retrieve a specific cart by its ID
    getCart: async (_: unknown, { id }: { id: string }) => {
      return await Cart.findById(id).populate("user items.product");
    },

    // Query to retrieve a specific product by its ID
    getProduct: async (_: unknown, { id }: { id: string }) => {
      console.log(id);
      const getProduct = await Product.findById(id);
      return getProduct;
    },

    // Query to retrieve all orders
    orders: async () => {
      const orders = await Order.find().populate("user items.product");
      return orders;
    },

    // Query to retrieve a specific order by its ID
    order: async (_: unknown, { id }: { id: string }) => {
      const order = (await Order.findById(id)).populate("user items.product");
      return order;
    },

    // Query to retrieve all orders for a specific user by their ID
    userOrders: async (_: unknown, { userId }: { userId: string }) => {
      const orders = await Order.find({ user: userId }).populate(
        "user items.products"
      );
      return orders;
    },
  },

  // Define mutation resolvers
  Mutation: {
    // Mutation to create a new product
    createProduct: async (
      _: unknown,
      { input }: { input: ProductInput },
      context: any
    ) => {
      // Check for admin authentication
      if (!context || !context.user || !context.user.admin) {
        throw new Error("Unauthorized");
      }
      console.log(`@@@@@@@@@@@@@@@@@@`, context.user.admin);
      // Extract product details from input
      const { name, description, price, image } = input;

      // Create new product object
      const product = new Product({ name, description, price, image });

      // Save new product object to database
      await product.save();

      // Return the newly created product object
      return product;
    },

    // Mutation to update an existing product
    updateProduct: async (
      _: unknown,
      { input }: { input: UpdateProductInput },
      context: any
    ) => {
      // Check for authentication
      if (!context) {
        throw new Error("Authentication required");
      }
      // Extract product details from input
      const { id, name, description, price, image } = input;
      // Find the product to update by its ID and update its details
      const product = await Product.findByIdAndUpdate(
        id,
        { name, description, price, image },
        { new: true }
      );
      // Return the updated product object
      return product;
    },

    // Mutation to delete an existing product
    deleteProduct: async (_: unknown, { id }: { id: string }, context: any) => {
      // Check for authentication
      if (!context) {
        throw new Error("Authentication required");
      }
      // Find the product to delete by its ID and delete it
      const deleteProduct = await Product.findByIdAndDelete(id);
      // Check if product was not found
      if (!deleteProduct) {
        return {
          message: "Product already deleted",
        };
      }
      // Return success message
      return {
        message: "Product deleted",
      };
    },

    // This function add product to the cart
    addToCart: async (_: unknown, { productId, quantity }, { user }) => {
      // Log the user object to ensure it exists
      console.log("user", user);

      try {
        // Check if the user exists and has an ID
        if (!user || !user.id) {
          throw new Error("invalid user");
        }

        return await addToCart(productId, quantity, user.id);
      } catch (error) {
        console.error(error);
        throw new Error("Failed to add item to cart");
      }
    },

    // This function updates the quantity of a cart item for the user
    updateCartItem: async (_:unknown, { cartItemId, quantity }, { user }) => {
      try {
        // Check if the user exists and has an ID
        if (!user || !user.id) {
          throw new Error("invalid user");
        }
        return await updateCartItem(cartItemId, quantity, user.id);
      } catch (error) {
        console.error(error);
        throw new Error("Failed to update cart item");
      }
    },

    // This function removes the quantity of a cart item for the user
    removeCartItem: async (_:unknown, { cartItemId }, { user }) => {
      console.log(cartItemId);
      try {
        // Check if the user is valid and has an ID
        if (!user || !user.id) {
          throw new Error("Invalid user");
        }

        return await removeCartItem(cartItemId, user.id);
      } catch (error) {
        console.error(error);
        throw new Error("Failed to remove item from cart");
      }
    },
    createOrder: async (_:unknown, { input: { items, status } }, { user }) => {
      try {
        return await createOrder(items, status, user);
      } catch (error) {
        console.error(error);
        throw new Error("Failed to create order");
      }
    },
    updateOrderStatus: async (_:unknown, { input: { id, status } }, { user }) => {
      try {
        // Check if the user is valid and has an ID
        if (!user || !user.id) {
          throw new Error("Invalid user");
        }
        // Return the success message
        return {
          message: "Updated Successfully",
        };
      
      } catch (error) {
        console.error(error);
        throw new Error("Failed to update order");
      }
    },

    // Deletes an order with the specified id
    deleteOrder: async (_: unknown, { id }: { id: string }, { user }) => {
      try {
        // Check if the user is authenticated
        if (!user || !user.id) {
          throw new Error("Invalid user");
        }
        // Return the success message
        return {
          message: "Order deleted successfully",
        };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to delete order");
      }
    },

    async createPaymentIntent(
      _: unknown,
      { orderId }: { orderId: string },
      context: any
    ) {
      try {
        // Retrieve the order from the database
        const order = await Order.findById(orderId).populate("user");

        // Check if the user is authorized to complete the payment
        if (!context || !context.user) {
          throw new Error("Not authorized to complete payment for this order");
        }
        // Create a payment method
        const paymentMethod = await stripe.paymentMethods.create({
          type: "card",
          card: {
            number: "4242424242424242",
            exp_month: 12,
            exp_year: 2041,
            cvc: "123",
          },
          billing_details: {
            name: context.user.name,
            email: context.user.email,
          },
        });

        // Calculate the order amount
        const amount = order.totalPrice * 100; // amount in the smallest currency unit
        const currency = "INR";
        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency,
          payment_method_types: ["card"],
          payment_method: paymentMethod.id,
          payment_method_options: {
            card: {
              request_three_d_secure: "any",
            },
          },
          confirm: true,
        });
        return {
          clientSecret: paymentIntent.client_secret,
          id: paymentIntent.id,
          click_Here_To_MakePayment:
            paymentIntent.next_action.use_stripe_sdk.stripe_js,
        };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to create payment intent");
      }
    },
    // This function handles user sign up process
    signUp: async (_: unknown, { input }) => {
      return await createUser(input);
    },
    // This function handles user sign in process
    // It takes user's name, email, and password as parameters
    // It returns an object that contains a JWT token, user ID, and a message
    signIn: async (
      _: unknown, // The parent value of this resolver function, which is not used here
      { email, password }: { email: string; password: string } // The arguments passed to this function
    ) => {
      // Find a user with the provided email
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Invalid email or password");
      }

      // Compare the provided password with the hashed password in the database using bcrypt
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Invalid email or password");
      }

      // Generate a JWT token for the user using the user ID as the payload
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);

      // Log the JWT token (for testing purposes)
      console.log(jwt.sign({ userId: user.id }, JWT_SECRET));

      // Return an object that contains the JWT token, user ID, and a message
      return { token, id: user.id, message: "User Logged In" };
    },
    signOut: async (
      _: unknown, // The parent value of this resolver function, which is not used here
      __: unknown, // The arguments passed to this function, which is not used here
      { user } // The context object, which should include the current authenticated user
    ) => {
      // Ensure that there is a current user
      if (!user) {
        throw new Error("User not authenticated");
      }
      // Return a message indicating that the user has been signed out
      return true;
    },
  },
};
