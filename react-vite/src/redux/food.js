import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  foods: null,
  loading: false,
  errors: null,
};

export const getAllFoods = createAsyncThunk(
  "foods/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/food/");
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Error in Returning Current User");
    }
  }
);

// export const getContainer = createAsyncThunk(
//   "containers/getOne",
//   async (id, { rejectWithValue }) => {
//     try {
//       const res = await fetch(`/api/container/${id}`);
//       const data = await res.json();
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.message || "Error in Returning Current User");
//     }
//   }
// );

const foodSlice = createSlice({
  name: "food",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllFoods.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(getAllFoods.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(getAllFoods.fulfilled, (state, action) => {
        state.loading = false;
        state.foods = action.payload;
      })
    //   .addCase(getContainer.pending, (state) => {
    //     state.loading = true;
    //     state.errors = null;
    //   })
    //   .addCase(getContainer.rejected, (state, action) => {
    //     state.loading = false;
    //     state.errors = action.payload;
    //   })
    //   .addCase(getContainer.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.container = action.payload;
    //   })
  }
});

export default foodSlice.reducer;