// Import necessary modules
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import mongoose from "mongoose";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import JWT from "jsonwebtoken";
import { User } from "./databasemodels/user";

// Define the secret used to sign and verify JWT tokens
const JWT_SECRET = "secret";

// Connect to the MongoDB database
mongoose.connect("mongodb://127.0.0.1:27017/store");
mongoose.connection
  .once("open", () => console.log("connected"))
  .on("error", (error) => {
    console.log("my error", error);
  });

// Create a new Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the server using the standalone server implementation
startStandaloneServer(server, {
  // Set up the context function to extract the user from the request headers
  context: async ({ req, res }) => {
    // Get the user token from the headers
    const token = req.headers.authorization || "";
    try {
      // Verify the token
      const processedToken = token.replace(/^Bearer/i, "").trim();
      const decoded = JWT.verify(processedToken, JWT_SECRET) as {
        userId: string;
      };

      // Find the user with the ID from the token
      const user = await User.findById(decoded.userId);

      // Add the user to the context
      return { user };
    } catch (err) {
      // Return null if there's an error or the token is invalid
      return { user: null };
    }
  },

  // Set up the server to listen on port 3000
  listen: { port: 3000 },
}).then((url) => {
  console.log(`Server running at 3000`);
});
