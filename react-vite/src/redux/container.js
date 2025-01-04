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
      const res = await fetch(`/api/container/${id}/new`, {
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
)

// export const thunkLogin = createAsyncThunk(
//   "session/login",
//   async ({ email, password }, { rejectWithValue }) => {
//     try {
//       const res = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: {"Content-Type": "application/json"},
//         body: JSON.stringify({ email, password }),
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         return rejectWithValue(data);
//       }
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.message || "Login Error");
//     }
//   }
// );

// export const thunkLogout = createAsyncThunk(
//   "session/logout",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await fetch("/api/auth/logout");
//       const data = await res.json();
//       return data.message;
//     } catch (error) {
//       return rejectWithValue(error.message || "Logout Error");
//     }
//   }
// );

// export const thunkSignup = createAsyncThunk(
//   "session/signup",
//   async ({ username, email, password }, { rejectWithValue }) => {
//     try {
//       const res = await fetch("/api/auth/signup", {
//         method: "POST",
//         headers: {"Content-Type": "application/json"},
//         body: JSON.stringify({ username, email, password }),
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         return rejectWithValue(data);
//       }
//       return data.user;
//     } catch (error) {
//       return rejectWithValue(error.message || "Signup Error");
//     }
//   }
// )

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
      .addCase(addFoodItems.fulfilled, (state, action) => {
        state.loading = false;
        // state.container = action.payload;
      })
  }
});

export default containerSlice.reducer;