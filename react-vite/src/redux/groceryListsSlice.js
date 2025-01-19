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

// Utility function to normalize an array by id
// const normalizeById = (array) =>
//   array.reduce((acc, item) => {
//     acc[item.id] = item;
//     return acc;
//   }, {});

// Async thunks
export const fetchGroceryLists = createAsyncThunk(
  "groceryLists/fetchGroceryLists",
  async (_, thunkAPI) => {
    const data = await apiRequest("/api/groceries/", {}, thunkAPI);
    // console.log("!!!data", data)
    return data;
  }
);

export const fetchGroceryListFoods = createAsyncThunk(
  "groceryLists/fetchGroceryListFoods",
  async (listId, thunkAPI) => {
    const url = `/api/groceries/${listId}`;
    const data = await apiRequest(url, {}, thunkAPI);
    return data.foods;
  }
);

export const createGroceryList = createAsyncThunk(
  "groceryLists/createGroceryList",
  async (newList, thunkAPI) => {
    const url = `/api/groceries/`;
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newList),
    };
    return apiRequest(url, options, thunkAPI);
  }
);

export const updateGroceryList = createAsyncThunk(
  "groceryLists/updateGroceryList",
  async (newList, thunkAPI) => {
    const url = `/api/groceries/${newList.id}`;
    const options = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newList),
    };
    return apiRequest(url, options, thunkAPI);
  }
);

export const deleteGroceryList = createAsyncThunk(
  "groceryLists/deleteGroceryList",
  async (listId, thunkAPI) => {
    const url = `/api/groceries/${listId}`;
    const options = { method: "DELETE" };
    await apiRequest(url, options, thunkAPI);
    return listId;
  }
);

// Initial state
const initialState = {
  lists: null,
  foods: null,
  loading: false,
  error: null,
};

// Slice definition
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
        state.lists = action.payload.grocery_lists;
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
        state.loading = false;
        state.foods = action.payload;
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



