import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000/grocery_lists";

// Fetch all grocery lists for the current user
export const fetchGroceryLists = createAsyncThunk(
  "groceryLists/fetchGroceryLists",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/`);
      return response.data.grocery_lists; // Access the "grocery_lists" key
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch a specific grocery list's foods
export const fetchGroceryListFoods = createAsyncThunk(
  "groceryLists/fetchGroceryListFoods",
  async (listId, thunkAPI) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${listId}`);
      return { listId, foods: response.data[listId] || [] }; // Return the listId and foods array
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Action to create a new grocery list
export const createGroceryList = createAsyncThunk(
    "groceryLists/createGroceryList",
    async (groceryList, thunkAPI) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/new`, groceryList);
        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
      }
    }
  );

// Update a grocery list
export const updateGroceryList = createAsyncThunk(
  "groceryLists/updateGroceryList",
  async ({ id, name }, thunkAPI) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, { name });
      return response.data; // Updated grocery list
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete a grocery list
export const deleteGroceryList = createAsyncThunk(
  "groceryLists/deleteGroceryList",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      return id; // Return the ID of the deleted list
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice definition
const groceryListsSlice = createSlice({
  name: "groceryLists",
  initialState: {
    lists: [],
    foodsByListId: {}, // Store foods keyed by list ID
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create a new grocery list
      .addCase(createGroceryList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGroceryList.fulfilled, (state, action) => {
        state.loading = false;
        state.lists.push(action.payload); // Add the new list to the state    
      })
      .addCase(createGroceryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch all grocery lists
      .addCase(fetchGroceryLists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroceryLists.fulfilled, (state, action) => {
        state.loading = false;
        state.lists = action.payload; // Save the lists
      })
      .addCase(fetchGroceryLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch a specific grocery list's foods
      .addCase(fetchGroceryListFoods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroceryListFoods.fulfilled, (state, action) => {
        const { listId, foods } = action.payload;
        state.loading = false;
        state.foodsByListId[listId] = foods; // Save foods for the specific list
      })
      .addCase(fetchGroceryListFoods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update a grocery list
      .addCase(updateGroceryList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGroceryList.fulfilled, (state, action) => {
        state.loading = false;
        const updatedList = action.payload;
        const index = state.lists.findIndex((list) => list.id === updatedList.id);
        if (index !== -1) {
          state.lists[index] = updatedList; // Update the specific grocery list
        }
      })
      .addCase(updateGroceryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete a grocery list
      .addCase(deleteGroceryList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGroceryList.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;
        state.lists = state.lists.filter((list) => list.id !== id); // Remove the deleted list
      })
      .addCase(deleteGroceryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default groceryListsSlice.reducer;

