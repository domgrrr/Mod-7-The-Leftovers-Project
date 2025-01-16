import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// Utility function for API requests
const apiRequest = async (url, options = {}, thunkAPI) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Request failed");
    }
    return await response.json();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || "An unexpected error occurred");
  }
};

// Fetch all grocery lists
export const fetchGroceryLists = createAsyncThunk(
  "groceryLists/fetchGroceryLists",
  async (_, thunkAPI) => {
    return apiRequest(`/api/groceries/`, {}, thunkAPI);
  }
);

// Fetch foods for a specific grocery list
export const fetchGroceryListFoods = createAsyncThunk(
  "groceryLists/fetchGroceryListFoods",
  async (listId, thunkAPI) => {
    const url = `/api/groceries/${listId}`;
    const data = await apiRequest(url, {}, thunkAPI);
    return { listId, foods: data.foods || [] };
  }
);

// Create a new grocery list
export const createGroceryList = createAsyncThunk(
  "groceryLists/createGroceryList",
  async (name, thunkAPI) => {
    const url = `/api/groceries/`;
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    };
    return apiRequest(url, options, thunkAPI);
  }
);

// Update an existing grocery list
export const updateGroceryList = createAsyncThunk(
  "groceryLists/updateGroceryList",
  async ({ listId, name }, thunkAPI) => {
    const url = `/api/groceries/${listId}`;
    const options = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    };
    return apiRequest(url, options, thunkAPI);
  }
);

// Delete a grocery list
export const deleteGroceryList = createAsyncThunk(
  "groceryLists/deleteGroceryList",
  async (listId, thunkAPI) => {
    const url = `/api/groceries/${listId}`;
    const options = { method: "DELETE" };
    await apiRequest(url, options, thunkAPI);
    return listId;
  }
);

// Reducer and initial state
const initialState = {
  lists: {},
  loading: false,
  error: null,
};

const groceryListsSlice = createSlice({
  name: "groceryLists",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all grocery lists
      .addCase(fetchGroceryLists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroceryLists.fulfilled, (state, action) => {
        state.loading = false;
        state.lists = action.payload.reduce((acc, list) => {
          acc[list.id] = list;
          return acc;
        }, {});
      })
      .addCase(fetchGroceryLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch foods for a specific list
      .addCase(fetchGroceryListFoods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroceryListFoods.fulfilled, (state, action) => {
        const { listId, foods } = action.payload;
        state.loading = false;
        if (state.lists[listId]) {
          state.lists[listId].foods = foods;
        }
      })
      .addCase(fetchGroceryListFoods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create a new grocery list
      .addCase(createGroceryList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGroceryList.fulfilled, (state, action) => {
        state.loading = false;
        const newList = action.payload;
        state.lists[newList.id] = newList;
      })
      .addCase(createGroceryList.rejected, (state, action) => {
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
        if (state.lists[updatedList.id]) {
          state.lists[updatedList.id] = updatedList;
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
        delete state.lists[action.payload];
      })
      .addCase(deleteGroceryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default groceryListsSlice.reducer;


