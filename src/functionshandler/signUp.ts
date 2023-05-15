import jwt from "jsonwebtoken";
// Hash the password using bcrypt
import bcrypt from "bcrypt";
import { User } from "../databasemodels/user";
import {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
} from "../validations/validation";
const JWT_SECRET = "secret";

export const createUser = async (input) => {
  const {
    name,
    email,
    password,
    isAdmin = false,
    phoneNumber,
    shippingAddress,
    billingAddress,
  } = input;

  // Check if a user with the same email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  validateEmail(email);
  validatePassword(password);
  validatePhoneNumber(phoneNumber);

  // Hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user with the provided name, email, hashed password, and shipping address
  const user = new User({
    name,
    email,
    password: hashedPassword,
    isAdmin,
    phoneNumber,
    shippingAddress,
    billingAddress,
  });
  await user.save();

  // Generate a JWT token for the user using the user ID as the payload
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    algorithm: "HS256",
  });

  // Return an object that contains the JWT token, user object, and a message
  return { token, user, message: "User Created" };
};
