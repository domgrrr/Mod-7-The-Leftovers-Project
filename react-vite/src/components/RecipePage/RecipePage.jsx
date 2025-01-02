import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

//Define recipepage component so just like a list of recipes
const RecipePage = () => {
    //state for storing recipes and error messages
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  //uhh i use useeffect to fetch the recipes from the backend not sure
  useEffect(() => {
    fetch('/api/recipes') // ADDED THE FETCH REQUEST fetch from back
      .then(response => {
        if (!response.ok) { //if response is not ok throw error
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setRecipes(data.recipes))
      .catch(error => setError(error));
  }, []);

  if (error) { //if error return error message
    return <div>Error: {error.message}</div>;
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