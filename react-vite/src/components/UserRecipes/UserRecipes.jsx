import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserRecipes } from '../../redux/recipeslice';
// Define UserRecipes component to display user's recipes
const UserRecipes = () => {
  const { userRecipes, loading } = useSelector((state) => state.recipes);
  const dispatch = useDispatch();

  useEffect(() => { // Fetch user recipes on component mount
    dispatch(fetchUserRecipes()); // Using thunk to fetch user recipes
  }, [dispatch]); // Dependency array ensures this runs only when `dispatch` changes

  if (loading) { // If loading, display loading message
    return <div>Loading...</div>;
  }

  return ( // Return list of user recipes
    <div className="recipe-page">
      <h1 className="recipe-page-title">Your Recipes</h1>
      <div className="recipe-grid">
        {userRecipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <img src={recipe.image_url} alt={recipe.name} className="recipe-image" />
            <h2 className="recipe-name">{recipe.name}</h2>
            <Link to={`/recipes/${recipe.id}`} className="view-details-button">View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserRecipes; // Export the component