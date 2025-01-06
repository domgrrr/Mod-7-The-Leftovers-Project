import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserRecipes, deleteRecipe } from '../../redux/recipeslice';
import RecipeFormModal from '../RecipeFormModal/RecipeFormModal'; // Import the RecipeFormModal component

// Define UserRecipes component to display user's recipes
const UserRecipes = () => {
  const { userRecipes, loading, errors } = useSelector((state) => state.recipes);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);

  useEffect(() => { // Fetch user recipes on component mount
    dispatch(fetchUserRecipes()); // Using thunk to fetch user recipes
  }, [dispatch]); // Dependency array ensures this runs only when `dispatch` changes

  const handleAddRecipe = () => {
    setCurrentRecipe(null);
    setIsModalOpen(true);
  };

  const handleEditRecipe = (recipe) => {
    setCurrentRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleDeleteRecipe = (recipeId) => {
    dispatch(deleteRecipe(recipeId));
  };

  if (loading) { // If loading, display loading message
    return <div>Loading...</div>;
  }

  if (errors) { // If errors, display error message
    return <div>Error: {errors}</div>;
  }

  return ( // Return list of user recipes
    <div className="recipe-page">
      <h1 className="recipe-page-title">Your Recipes</h1>
      <button onClick={handleAddRecipe}>Add New Recipe</button>
      <div className="recipe-grid">
        {userRecipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <img src={recipe.image_url} alt={recipe.name} className="recipe-image" />
            <h2 className="recipe-name">{recipe.name}</h2>
            <Link to={`/recipes/${recipe.id}`} className="view-details-button">View Details</Link>
            <button onClick={() => handleEditRecipe(recipe)}>Edit</button>
            <button onClick={() => handleDeleteRecipe(recipe.id)}>Delete</button>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <RecipeFormModal
          recipe={currentRecipe}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default UserRecipes; // Export the component