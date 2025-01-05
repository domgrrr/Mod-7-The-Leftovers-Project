import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Helper function to handle fetch requests and check for errors
// const fetchData = async (url, options = {}) => {
//   const response = await fetch(url, options);

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.message || "Something went wrong");
//   }

//   return response.json();
// };

// Fetch all grocery lists for the current user
export const fetchGroceryLists = createAsyncThunk(
  "groceryLists/fetchGroceryLists",
  async (_, thunkAPI) => {
    try {

      console.log("Fetching all grocery lists...");
      const response = await fetch(`/api/groceries/`);
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching grocery lists:", errorData.message);
        throw new Error(errorData.message || "Failed to fetch grocery lists");
      }
      const data = await response.json();
      console.log("Fetched grocery lists successfully:", data);

      return data.grocery_lists; // Access the "grocery_lists" key
    } catch (error) {
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
      const response = await fetch(`/api/groceries/${listId}`);
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching grocery list foods:", errorData.message);
        throw new Error(errorData.message || "Failed to fetch list foods");
      }
      const data = await response.json();
      console.log(`Fetched foods for list ${listId}:`, data);
      return { listId, foods: data[listId] || [] };

    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// Action to create a new grocery list
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

      const data = await response.json();
      return data; // Return the new grocery list
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
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

      const data = await response.json();
      return data; // Updated grocery list
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Delete a grocery list
export const deleteGroceryList = createAsyncThunk(
  "groceryLists/deleteGroceryList",
  async (id, thunkAPI) => {
    try {
      await fetch(`/api/grocery/${id}`, {
        method: "DELETE",
      });
      return id; // Return the ID of the deleted list
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
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

