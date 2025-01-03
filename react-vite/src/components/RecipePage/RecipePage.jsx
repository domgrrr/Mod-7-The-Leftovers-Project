import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchRecipes } from '../../redux/recipeslice';

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
    <div>
      <h1>Recipes</h1>
      <ul>
        {recipes.map(recipe => (
          <li key={recipe.id}> 
            <h2>{recipe.name}</h2>
            <p>{recipe.directions}</p> 
            <img src={recipe.image_url} alt={recipe.name} />
            <Link to={`/recipes/${recipe.id}`}>View Details</Link> 
          </li>
        ))} 
      </ul>
    </div>
  );
};

export default RecipePage; //export