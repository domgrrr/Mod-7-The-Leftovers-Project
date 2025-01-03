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
  
  const initialState = { //initial state for recipes , we can put it higher if needed not sure
    recipes: [],
    recipe: null,
    loading: false,
    errors: null,
  };

  //do i need to add one to fetch one singular recipe? like /recipe/id kinda thing not sure... 

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
        });
    },
  });
  
  export default recipeSlice.reducer;



  //NEED TO MAKE A THUNK FOR RECIPE DETAILS PAGE?!?!?! not sure we will find out hehe