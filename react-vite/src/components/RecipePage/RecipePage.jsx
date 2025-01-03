import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchRecipes } from '../../redux/recipeslice';
import './RecipePage.css';

//Define recipepage component so just like a list of recipes
const RecipePage = () => {
  const { recipes, loading, errors } = useSelector((state) => state.recipes);
  const dispatch = useDispatch();

  useEffect(() => { //fetch recipes on page load
    dispatch(fetchRecipes()); //using thunk to fetch recipes
  }, [dispatch]); //dispatch does not change so no need to add it to the dependency array

  if (loading) { //if loading display loading
    return <div>Loading...</div>;
  }

  if (errors) { //if errors display errors
    return <div>Error: {errors}</div>;
  }

  return ( //return list of recipes 
    //map through recipes and display name, directions, image, and link to recipe details
    //link to recipe details so need a recipe details page?^
    <div className="recipe-page">
      <h1 className="recipe-page-title">Browse Recipes Below</h1>
      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <h2 className="recipe-name">{recipe.name}</h2>
            <img src={recipe.image_url} alt={recipe.name} className="recipe-image" />
            <Link to={`/recipes/${recipe.id}`} className="view-details-button">View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipePage; //export