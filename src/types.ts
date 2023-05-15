// Define interfaces for the datatypes used in the applicatioin

export interface UserInput {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  phoneNumber: string;
  shippingAddress: Address;
  billingAddress: Address;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zip: number;
  country: string;
}


export interface CreateOrderInput {
  items: { id: string }[];
  status: string;
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface UpdateProductInput {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  image?: string;
}

export interface UpdateOrderStatusInput {
  id: string;
  status: string;
}
