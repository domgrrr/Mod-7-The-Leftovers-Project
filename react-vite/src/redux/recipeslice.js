import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchRecipes = createAsyncThunk( //fetch all the recipes from backend
    'recipes/fetchRecipes', 
    async (_, { rejectWithValue }) => { //async function
      try {
        const response = await fetch('/api/recipe'); //fetch recipes from backend route!
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json(); //parse response to json
        return data.recipes; //return recipes
      } catch (error) {
        return rejectWithValue(error.message); //return error message
      }
    }
  );

  //fetcy recipe details funk here
  export const fetchRecipeDetails = createAsyncThunk( //fetch recipe details from backend
    'recipes/fetchRecipeDetails',
    async (id, { rejectWithValue }) => { //async function
        try {
            const response = await fetch(`/api/recipe/${id}`); //fetch recipe details id from backend route
            if (!response.ok) { //if response is not ok throw error
                throw new Error('Network response was not ok');
            }
            const data = await response.json(); //parse response to json
            return data; //return recipe data
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Fetch user-specific recipes from backend
export const fetchUserRecipes = createAsyncThunk(
  'recipes/fetchUserRecipes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/recipe/user');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.recipes;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

  
  const initialState = { //initial state for recipes , we can put it higher if needed not sure
    recipes: [],
    recipe: null,
    userRecipes: [],
    loading: false,
    errors: null,
  };


  const recipeSlice = createSlice({
    name: 'recipes',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
          .addCase(fetchRecipes.pending, (state) => {
            state.loading = true;
            state.errors = null;
          })
          .addCase(fetchRecipes.fulfilled, (state, action) => {
            state.loading = false;
            state.recipes = action.payload;
          })
          .addCase(fetchRecipes.rejected, (state, action) => {
            state.loading = false;
            state.errors = action.payload;
          })
          .addCase(fetchRecipeDetails.pending, (state) => {
            state.loading = true;
            state.errors = null;
          })
          .addCase(fetchRecipeDetails.fulfilled, (state, action) => {
            state.loading = false;
            state.recipeDetails = action.payload;
          })
          .addCase(fetchRecipeDetails.rejected, (state, action) => {
            state.loading = false;
            state.errors = action.payload;
          })
          .addCase(fetchUserRecipes.pending, (state) => {
            state.loading = true;
            state.errors = null;
          })
          .addCase(fetchUserRecipes.fulfilled, (state, action) => {
            state.loading = false;
            state.userRecipes = action.payload;
          })
          .addCase(fetchUserRecipes.rejected, (state, action) => {
            state.loading = false;
            state.errors = action.payload;
          });
      },
    });
  
  export default recipeSlice.reducer;



  //NEED TO MAKE A THUNK FOR RECIPE DETAILS PAGE