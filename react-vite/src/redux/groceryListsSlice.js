import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all grocery lists for the current user
export const fetchGroceryLists = createAsyncThunk(
  "groceryLists/fetchGroceryLists",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`/api/grocery/`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch grocery lists");
      }
      const data = await response.json();
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
      const response = await fetch(`/api/grocery/${listId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch list foods");
      }
      const data = await response.json();
      return { listId, foods: data[listId] || [] };
    } catch (error) {
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
        throw new Error(errorData.message || "Failed to create grocery list");
      }
      return await response.json();
    } catch (error) {
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
        throw new Error(errorData.message || "Failed to update grocery list");
      }
      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// Delete a grocery list
export const deleteGroceryList = createAsyncThunk(
  "groceryLists/deleteGroceryList",
  async (id, thunkAPI) => {
    try {
      const response = await fetch(`/api/grocery/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete grocery list");
      }
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// Slice definition
const groceryListsSlice = createSlice({
  name: "groceryLists",
  initialState: {
    lists: [],
    foodsByListId: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createGroceryList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGroceryList.fulfilled, (state, action) => {
        state.loading = false;
        state.lists.push(action.payload);
      })
      .addCase(createGroceryList.rejected, (state, action) => {
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

