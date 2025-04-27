import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const initialState = {
  events: [],
  event: null,
  organizerEvents: [],
  pagination: {
    totalEvents: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10
  },
  isLoading: false,
  error: null,
  success: false
};

// Get all events with pagination and filters
export const getEvents = createAsyncThunk(
  'events/getAll',
  async (params, thunkAPI) => {
    try {
      const { page = 1, limit = 10, category, startDate, endDate, search, sort, order } = params || {};
      
      let url = `${API_URL}/events?page=${page}&limit=${limit}`;
      
      if (category) url += `&category=${category}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;
      if (search) url += `&search=${search}`;
      if (sort) url += `&sort=${sort}`;
      if (order) url += `&order=${order}`;
      
      const response = await axios.get(url);
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

// Get event by ID
export const getEventById = createAsyncThunk(
  'events/getById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/events/${id}`);
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

// Create new event
export const createEvent = createAsyncThunk(
  'events/create',
  async (eventData, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.user.token;
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      };
      
      const response = await axios.post(`${API_URL}/events`, eventData, config);
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

// Update event
export const updateEvent = createAsyncThunk(
  'events/update',
  async ({ id, eventData }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.user.token;
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      };
      
      const response = await axios.put(`${API_URL}/events/${id}`, eventData, config);
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

// Delete event
export const deleteEvent = createAsyncThunk(
  'events/delete',
  async (id, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      const response = await axios.delete(`${API_URL}/events/${id}`, config);
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

// Get organizer events
export const getOrganizerEvents = createAsyncThunk(
  'events/getOrganizerEvents',
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      const response = await axios.get(`${API_URL}/events/organizer`, config);
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

export const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = false;
    },
    clearEvent: (state) => {
      state.event = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all events
      .addCase(getEvents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload.events;
        state.pagination = action.payload.pagination;
      })
      .addCase(getEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get event by ID
      .addCase(getEventById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEventById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.event = action.payload.event;
      })
      .addCase(getEventById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create event
      .addCase(createEvent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.organizerEvents.push(action.payload.event);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update event
      .addCase(updateEvent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.event = action.payload.event;
        state.organizerEvents = state.organizerEvents.map(event => 
          event.id === action.payload.event.id ? action.payload.event : event
        );
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete event
      .addCase(deleteEvent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.organizerEvents = state.organizerEvents.filter(
          event => event.id !== action.meta.arg
        );
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get organizer events
      .addCase(getOrganizerEvents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrganizerEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.organizerEvents = action.payload.events;
      })
      .addCase(getOrganizerEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { reset, clearEvent } = eventSlice.actions;
export default eventSlice.reducer;
