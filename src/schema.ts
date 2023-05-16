import {
  CreateOrderInput,
  ProductInput,
  UpdateProductInput,
  UserInput,
  UpdateOrderStatusInput,
} from "./types";
// Define a Graphql query and mutation schema using SDL
export const typeDefs = `
    type User {
      id: ID!
      name: String!
      email: String!
      password: String!
      isAdmin: Boolean!
      phoneNumber: String!
      shippingAddress: Address!
      billingAddress: Address!
    }

    input UserInput {
      name: String!
      email: String!
      password: String!
      isAdmin: Boolean
      phoneNumber: String!
      shippingAddress: AddressInput!
      billingAddress: AddressInput!
    }

    input AddressInput {
      street: String!
      city: String!
      state: String!
      zip: Int!
      country: String!
    }

    type Product {
      id: ID!
      name: String!
      description: String!
      price: Float!
      image: String!
    }

    type Address {
      street: String!
      city: String!
      state: String!
      zip: Int!
      country: String!
    }

    type Cart {
      id: ID!
      items: [CartItem]
    }

    type CartItem {
      id: ID
      product: Product
      quantity: Int
    }

    input CartItemInput {
      id: ID!
    }

    type Order {
      id: ID!
      items: [ CartItem ]
      totalPrice: Float!
      status: String
    }

    type Status {
      id: String
      message: String
      token: String
    }
    
    input UpdateCartItem {
      cartItemId: ID!
      quantity: Int!
    }
     
    input RemoveCartItemInput {
      cartItemId: ID!
    }

    input ProductInput {
      name: String!
      description: String!
      price: Float!
      image: String!
    }
    
    input UpdateProductInput {
      id: ID!
      name: String
      description: String
      price: Float
      image: String
    }

    input CreateOrderInput {
      items: [CartItemInput!]!
    }
   
    input UpdateOrderStatusInput {
      id: ID!
      status: String!
    }
   
    input PaymentInput {
      token: String
      amount: Float
    }

    type PaymentIntent {
      id: String
      clientSecret: String
      click_Here_To_MakePayment: String
    }

    type Response {
      message: String
    }

    type Query {
      products(limit: Int, offset: Int): [Product!]!
      getProduct(id: ID!): Product
      cart: [Cart]
      getCart(id: ID!):Cart
      orders: [Order!]!
      order(id: ID!): Order
      userOrders(userId: ID!): [Order!]!
    }
  
    type Mutation {
      createProduct(input: ProductInput!): Product!
      updateProduct(input: UpdateProductInput!): Product!
      deleteProduct(id: ID!): Status
      addToCart(productId: [ID!], quantity: Int!, userId: ID!): Cart
      updateCartItem(cartItemId: ID!, quantity: Int!): Cart
      removeCartItem(cartItemId: ID!): Cart
      createOrder(input: CreateOrderInput!): Order
      updateOrderStatus(input: UpdateOrderStatusInput!): Response
      deleteOrder(id: ID!): Response
      signUp(input: UserInput!): Status
      signIn(email: String!, password: String!): Status
      signOut: Boolean!
      createPaymentIntent(orderId: String): PaymentIntent
    }`;

export {
  CreateOrderInput,
  ProductInput,
  UserInput,
  UpdateProductInput,
  UpdateOrderStatusInput,
};
