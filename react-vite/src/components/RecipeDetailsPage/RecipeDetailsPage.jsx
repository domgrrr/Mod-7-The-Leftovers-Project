import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchRecipeDetails } from '../../redux/recipeslice';

const RecipeDetailsPage= () => {
    const {id} = useParams(); //get the id from the url
    const dispatch = useDispatch();
    const { recipeDetails, loading, errors } = useSelector((state) => state.recipes);

    useEffect(() => {
        dispatch(fetchRecipeDetails(id)); //fetch recipe details on page load
    }, [dispatch, id]); //dispatch and id do not change so no need to add to dependency array

    if (loading) {
        return <div>Loading...</div>;
      }
    
      if (errors) {
        return <div>Error: {errors}</div>;
      }
    
      if (!recipeDetails) {
        return <div>No recipe details found.</div>;
      }

      return (
        <div className="recipe-details-page">
          <h1 className="recipe-title">{recipeDetails.name}</h1>
          <img src={recipeDetails.image_url} alt={recipeDetails.name} className="recipe-image" />
          <p className="recipe-directions">{recipeDetails.directions}</p>
          <h2>Ingredients</h2>
          <ul>
            {recipeDetails.ingredients.map((ingredient) => (
              <li key={ingredient.food_id}>
                {ingredient.name}: {ingredient.amount}
              </li>
            ))}
          </ul>
        </div>
      );
}

export default RecipeDetailsPage;