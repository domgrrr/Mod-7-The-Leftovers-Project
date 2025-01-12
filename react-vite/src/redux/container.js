import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  containers: null,
  container: null,
  loading: false,
  errors: null,
};

export const getAllContainers = createAsyncThunk(
  "containers/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/container/");
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Error in Returning Current User");
    }
  }
);

export const getContainer = createAsyncThunk(
  "containers/getOne",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/container/${id}`);
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Error in Returning Current User");
    }
  }
);

export const addFoodItems = createAsyncThunk(
  "container/addFood",
  async ({ id, addedFoodItems }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/container/${id}/add`, {
        method: "POST", 
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({food: addedFoodItems})
      });
      const data = await res.json();
      if (!res.ok) {
        return rejectWithValue(data);
      }
      return data // return data.food
    } catch (error) {
      return rejectWithValue(error.message || "Unsuccessful Food to Container")
    }
  }
);

export const editFoodItem = createAsyncThunk(
  "container/editFood",
  async ({ foodID, foodItem }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/container/${foodID}/edit`, {
        method: "PUT", 
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({food: foodItem})
      });
      const data = await res.json();
      if (!res.ok) {
        return rejectWithValue(data);
      }
      return data // return data.food
    } catch (error) {
      return rejectWithValue(error.message || "Unsuccessful Food to Container")
    }
  }
);

export const removeFood = createAsyncThunk(
  "container/removeFood",
  async (id, { rejectWithValue }) => {
    try {

      await fetch(`/api/container/${id}/delete`, {
        method: 'DELETE',
      });
      return { "message": "Delete Ok" }
    } catch (error) {
      return rejectWithValue(error.message || "Unsuccessful Delete")
  }
 }
);

const containerSlice = createSlice({
  name: "containers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllContainers.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(getAllContainers.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(getAllContainers.fulfilled, (state, action) => {
        state.loading = false;
        state.containers = action.payload;
      })
      .addCase(getContainer.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(getContainer.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(getContainer.fulfilled, (state, action) => {
        state.loading = false;
        state.container = action.payload;
      })
      .addCase(addFoodItems.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(addFoodItems.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(addFoodItems.fulfilled, (state) => {
        state.loading = false;
        // state.container = action.payload;
      })
      .addCase(editFoodItem.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(editFoodItem.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(editFoodItem.fulfilled, (state) => {
        state.loading = false;
        // state.container = action.payload;
      })
      .addCase(removeFood.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(removeFood.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(removeFood.fulfilled, (state) => {
        state.loading = false;
        // state.container = action.payload;

      });
  }
});

export default containerSlice.reducer;