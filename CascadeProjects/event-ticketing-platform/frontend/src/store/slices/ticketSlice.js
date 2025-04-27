import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const initialState = {
  tickets: [],
  ticket: null,
  isLoading: false,
  error: null,
  success: false
};

// Get user tickets
export const getUserTickets = createAsyncThunk(
  'tickets/getUserTickets',
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      const response = await axios.get(`${API_URL}/tickets/user`, config);
      return response.data;
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
        
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get ticket by ID
export const getTicketById = createAsyncThunk(
  'tickets/getById',
  async (id, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      const response = await axios.get(`${API_URL}/tickets/${id}`, config);
      return response.data;
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
        
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Purchase tickets
export const purchaseTickets = createAsyncThunk(
  'tickets/purchase',
  async (purchaseData, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      // Create order
      const orderResponse = await axios.post(`${API_URL}/orders`, {
        eventId: purchaseData.eventId,
        quantity: purchaseData.quantity
      }, config);
      
      // Process payment
      const paymentResponse = await axios.post(`${API_URL}/payments`, {
        orderId: orderResponse.data.order.id,
        paymentMethod: 'paypal',
        paymentId: purchaseData.paymentId
      }, config);
      
      return paymentResponse.data;
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
        
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Validate ticket (for event organizers)
export const validateTicket = createAsyncThunk(
  'tickets/validate',
  async (ticketId, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      const response = await axios.put(`${API_URL}/tickets/${ticketId}/validate`, {}, config);
      return response.data;
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
        
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = false;
    },
    clearTicket: (state) => {
      state.ticket = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get user tickets
      .addCase(getUserTickets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tickets = action.payload.tickets;
      })
      .addCase(getUserTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get ticket by ID
      .addCase(getTicketById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTicketById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ticket = action.payload.ticket;
      })
      .addCase(getTicketById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Purchase tickets
      .addCase(purchaseTickets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(purchaseTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.tickets = [...state.tickets, ...action.payload.tickets];
      })
      .addCase(purchaseTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Validate ticket
      .addCase(validateTicket.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(validateTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.ticket = action.payload.ticket;
        state.tickets = state.tickets.map(ticket => 
          ticket.id === action.payload.ticket.id ? action.payload.ticket : ticket
        );
      })
      .addCase(validateTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { reset, clearTicket } = ticketSlice.actions;
export default ticketSlice.reducer;
