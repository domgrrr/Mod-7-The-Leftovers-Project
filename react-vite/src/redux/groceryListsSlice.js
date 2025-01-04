import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all grocery lists for the current user
export const fetchGroceryLists = createAsyncThunk(
  "groceryLists/fetchGroceryLists",
  async (_, thunkAPI) => {
    try {
      console.log("Fetching all grocery lists...");
      const response = await fetch(`/api/grocery/`);
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching grocery lists:", errorData.message);
        throw new Error(errorData.message || "Failed to fetch grocery lists");
      }
      const data = await response.json();
      console.log("Fetched grocery lists successfully:", data);
      return data.grocery_lists; // Access the "grocery_lists" key
    } catch (error) {
      console.error("Error in fetchGroceryLists:", error.message);
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// Fetch a specific grocery list's foods
export const fetchGroceryListFoods = createAsyncThunk(
  "groceryLists/fetchGroceryListFoods",
  async (listId, thunkAPI) => {
    try {
      console.log(`Fetching foods for grocery list with ID: ${listId}`);
      const response = await fetch(`/api/grocery/${listId}`);
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching grocery list foods:", errorData.message);
        throw new Error(errorData.message || "Failed to fetch list foods");
      }
      const data = await response.json();
      console.log(`Fetched foods for list ${listId}:`, data);
      return { listId, foods: data[listId] || [] };
    } catch (error) {
      console.error("Error in fetchGroceryListFoods:", error.message);
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// Create a new grocery list
export const createGroceryList = createAsyncThunk(
  "groceryLists/createGroceryList",
  async (groceryList, thunkAPI) => {
    try {
      const response = await fetch(`/api/grocery/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(groceryList),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error creating grocery list:", errorData.message);
        throw new Error(errorData.message || "Failed to create grocery list");
      }
      const createdList = await response.json();
      console.log("Created grocery list successfully:", createdList);
      return createdList;
    } catch (error) {
      console.error("Error in createGroceryList:", error.message);
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// Update a grocery list
export const updateGroceryList = createAsyncThunk(
  "groceryLists/updateGroceryList",
  async ({ id, name }, thunkAPI) => {
    try {
      const response = await fetch(`/api/grocery/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating grocery list:", errorData.message);
        throw new Error(errorData.message || "Failed to update grocery list");
      }
      const updatedList = await response.json();
      console.log("Updated grocery list successfully:", updatedList);
      return updatedList;
    } catch (error) {
      console.error("Error in updateGroceryList:", error.message);
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// Delete a grocery list
export const deleteGroceryList = createAsyncThunk(
  "groceryLists/deleteGroceryList",
  async (id, thunkAPI) => {
    try {
      console.log(`Deleting grocery list with ID: ${id}`);
      const response = await fetch(`/api/grocery/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error deleting grocery list:", errorData.message);
        throw new Error(errorData.message || "Failed to delete grocery list");
      }
      console.log("Deleted grocery list successfully:", id);
      return id;
    } catch (error) {
      console.error("Error in deleteGroceryList:", error.message);
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// Slice definition
const groceryListsSlice = createSlice({
  name: "groceryLists",
  initialState: {
    lists: [], // Stores all grocery lists
    foodsByListId: {}, // Stores foods grouped by their list ID
    loading: false, // Indicates loading state
    error: null, // Stores any errors
  },
  reducers: {},
  extraReducers: (builder) => {
    // Handle the lifecycle of each async thunk
    builder
      .addCase(createGroceryList.pending, (state) => {
        console.log("Creating grocery list...");
        state.loading = true;
        state.error = null;
      })
      .addCase(createGroceryList.fulfilled, (state, action) => {
        console.log("Successfully created grocery list:", action.payload);
        state.loading = false;
        state.lists.push(action.payload);
      })
      .addCase(createGroceryList.rejected, (state, action) => {
        console.error("Error creating grocery list:", action.payload);
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchGroceryLists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroceryLists.fulfilled, (state, action) => {
        state.loading = false;
        state.lists = action.payload;
      })
      .addCase(fetchGroceryLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchGroceryListFoods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroceryListFoods.fulfilled, (state, action) => {
        const { listId, foods } = action.payload;
        state.loading = false;
        state.foodsByListId[listId] = foods;
      })
      .addCase(fetchGroceryListFoods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateGroceryList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGroceryList.fulfilled, (state, action) => {
        state.loading = false;
        const updatedList = action.payload;
        const index = state.lists.findIndex((list) => list.id === updatedList.id);
        if (index !== -1) {
          state.lists[index] = updatedList;
        }
      })
      .addCase(updateGroceryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteGroceryList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGroceryList.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;
        state.lists = state.lists.filter((list) => list.id !== id);
      })
      .addCase(deleteGroceryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default groceryListsSlice.reducer;

