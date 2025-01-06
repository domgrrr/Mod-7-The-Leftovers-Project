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
// Add a new recipe
export const addRecipe = createAsyncThunk(
  'recipes/addRecipe',
  async (recipe, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/recipe/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update an existing recipe
export const updateRecipe = createAsyncThunk(
  'recipes/updateRecipe',
  async (recipe, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/recipe/${recipe.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete a recipe
export const deleteRecipe = createAsyncThunk(
  'recipes/deleteRecipe',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/recipe/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return { id };
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
          })
          .addCase(addRecipe.fulfilled, (state, action) => {
            state.userRecipes.push(action.payload);
            state.recipes.push(action.payload);
          })
          .addCase(updateRecipe.fulfilled, (state, action) => {
            const index = state.userRecipes.findIndex(recipe => recipe.id === action.payload.id);
            if (index !== -1) {
              state.userRecipes[index] = action.payload;
            }
            const mainIndex = state.recipes.findIndex(recipe => recipe.id === action.payload.id);
            if (mainIndex !== -1) {
              state.recipes[mainIndex] = action.payload;
            }
          })
          .addCase(deleteRecipe.fulfilled, (state, action) => {
            state.userRecipes = state.userRecipes.filter(recipe => recipe.id !== action.payload.id);
            state.recipes = state.recipes.filter(recipe => recipe.id !== action.payload.id);
          });
      },
    });
  
  export default recipeSlice.reducer;



  //NEED TO MAKE A THUNK FOR RECIPE DETAILS PAGE