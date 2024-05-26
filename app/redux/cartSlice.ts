import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { AppDispatch } from './store';

export interface CartItem {
  _id: string;
  name: string;
  price: string;
  quantity: number;
  product_id: string;
  product_image: string;
}

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

export const loadCart = createAsyncThunk('cart/load', async () => {
  const response = await fetch('/api/cart');
  if (!response.ok) {
    throw new Error('Failed to load cart');
  }
  const cart: CartItem[] = await response.json();
  return cart;
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const { _id: id, product_id, name, price, quantity, product_image} = action.payload;
      const existingItemIndex = state.items.findIndex(item => item._id === id);

      if (existingItemIndex !== -1) {
        state.items[existingItemIndex].quantity += quantity;
      } else {
        state.items.push({ _id: id, product_id, name, price, quantity, product_image });
      }
    },
    updateItemQuantity: (state, action: PayloadAction<{ product_id: string, quantity: number }>) => {
      const { product_id, quantity } = action.payload;
      const existingItem = state.items.find(item => item.product_id === product_id);

      if (existingItem) {
        existingItem.quantity = quantity;
      }
    },
    incrementItemQuantity: (state, action: PayloadAction<{ product_id: string }>) => {
      const { product_id } = action.payload;
      const existingItem = state.items.find(item => item.product_id === product_id);

      if (existingItem) {
        existingItem.quantity += 1;
      }
    },
    decrementItemQuantity: (state, action: PayloadAction<{ product_id: string }>) => {
      const { product_id } = action.payload;
      const existingItem = state.items.find(item => item.product_id === product_id);

      if (existingItem && existingItem.quantity > 1) {
        existingItem.quantity -= 1;
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      const idToRemove = action.payload;
      state.items = state.items.filter(item => item._id !== idToRemove);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    });
  },
});

export const {
  addItem,
  updateItemQuantity,
  incrementItemQuantity,
  decrementItemQuantity,
  removeItem,
  clearCart,
} = cartSlice.actions;

export const clearCartInDb = () => async (dispatch: AppDispatch) => {
  try {
    const response = await fetch('/api/clear-cart', {
      method: 'POST',
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to clear cart in database:', errorData);
      throw new Error('Failed to clear cart in database');
    }

    dispatch(clearCart());
  } catch (error) {
    console.error('Failed to clear cart in database. Error details:', error);
  }
};

export const updateItemQuantityInDb = (item: CartItem) => async (dispatch: AppDispatch) => {
  try {
    const response = await fetch(`/api/cart/${item.product_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity: item.quantity }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to update item quantity in database:', errorData);
      throw new Error('Failed to update item quantity in database');
    }

    dispatch(updateItemQuantity({ product_id: item.product_id, quantity: item.quantity }));
  } catch (error) {
    console.error('Failed to update item quantity in database. Error details:', error);
  }
};

export const incrementItemQuantityInDb = (product_id: string) => async (dispatch: AppDispatch, getState: () => any) => {
  try {
    const state = getState();
    const item = state.cart.items.find((item: CartItem) => item.product_id === product_id);
    if (item) {
      const newQuantity = item.quantity + 1;
      const response = await fetch(`/api/cart/${product_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to increment item quantity in database:', errorData);
        throw new Error('Failed to increment item quantity in database');
      }

      dispatch(incrementItemQuantity({ product_id }));
    }
  } catch (error) {
    console.error('Failed to increment item quantity in database. Error details:', error);
  }
};

export const decrementItemQuantityInDb = (product_id: string) => async (dispatch: AppDispatch, getState: () => any) => {
  try {
    const state = getState();
    const item = state.cart.items.find((item: CartItem) => item.product_id === product_id);
    if (item && item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      const response = await fetch(`/api/cart/${product_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to decrement item quantity in database:', errorData);
        throw new Error('Failed to decrement item quantity in database');
      }

      dispatch(decrementItemQuantity({ product_id }));
    }
  } catch (error) {
    console.error('Failed to decrement item quantity in database. Error details:', error);
  }
};

export const addItemToDbAndStore = (item: CartItem) => async (dispatch: AppDispatch, getState: () => any) => {
  try {
    const state = getState();
    const existingItem = state.cart.items.find((cartItem: CartItem) => cartItem.product_id === item.product_id);

    if (existingItem) {
      // Increment quantity if item already exists
      const newQuantity = existingItem.quantity + 1;
      const response = await axios.put(`/api/cart/${item.product_id}`, { quantity: newQuantity });
      dispatch(updateItemQuantity({ product_id: item.product_id, quantity: newQuantity }));
    } else {
      // Add new item if it doesn't exist
      const response = await axios.post('/api/cart', item);
      dispatch(addItem(response.data));
    }
  } catch (error) {
    console.error('Failed to add item to database:', error);
  }
};



export default cartSlice.reducer;
