import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRecipe, updateRecipe, fetchRecipeDetails } from "../../redux/recipeslice";
import { getAllFoods } from "../../redux/food";
import "./RecipeFormModal.css";

function RecipeFormModal({ recipe, currIngredients, onClose }) {
  const dispatch = useDispatch();
  const { foods } = useSelector(store => store.food);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [directions, setDirections] = useState("");
  const [ingredients, setIngredients] = useState([{ food_id: '', amount: ''}]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (recipe) {
      setName(recipe.name);
      setImageUrl(recipe.image_url);
      setDirections(recipe.directions);
      if (currIngredients && currIngredients.length > 0) {
        setIngredients(currIngredients.map(ing => ({
          food_id: ing.food_id,
          amount: ing.amount || ''
        })));
      }
    }
  }, [recipe, currIngredients]);

  useEffect(() => {
    dispatch(getAllFoods());
  }, [dispatch]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { food_id: '', amount: ''}]);
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

 // ...existing code...

const handleSubmit = async (e) => {
  e.preventDefault();

  // Filter out any ingredients with empty food_id
  const validIngredients = ingredients.filter(ing => ing.food_id); //filter ingredients

  const newRecipe = { //include recipe_foods in the new recipe object
    name,
    image_url: imageUrl,
    directions,
    recipe_foods: validIngredients // Ensure this field is correctly named
  };

  console.log("Submitting recipe:", newRecipe); // Debugging line

  const action = recipe // Check if we're editing or adding a recipe
    ? updateRecipe({ ...newRecipe, id: recipe.id }) 
    : addRecipe(newRecipe);
    
  const result = await dispatch(action);

  if (result.type.endsWith("rejected")) {
    setErrors(result.payload);
  } else {
    // Fetch the updated recipe details if we're editing
    if (recipe) {
      await dispatch(fetchRecipeDetails(recipe.id));
    }
    onClose();
  }
};

// ...existing code...

  const formRep = (i) => {
    return (
      <div key={`form_${i}`}>
        <label>
          Food Name
          <select
            value={ingredients[i].food_id}
            onChange={(e) => {
              const newIngredients = [...ingredients];
              newIngredients[i] = {
                ...newIngredients[i],
                food_id: e.target.value
              };
              setIngredients(newIngredients);
            }}
            required
          >
            <option value="">--Choose an Option--</option>
            {foods?.map((food) => (
              <option key={food.id} value={food.id}>
                {food.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Amount
          <input
            type="text"
            value={ingredients[i].amount}
            placeholder="Optional"
            onChange={(e) => {
              const newIngredients = [...ingredients];
              newIngredients[i] = {
                ...newIngredients[i],
                amount: e.target.value
              };
              setIngredients(newIngredients);
            }}
          />
        </label>
        {i === 0 ? null : (
          <button type="button" onClick={() => handleRemoveIngredient(i)}>
            Remove
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="modal-backdrop">
      <div className="recipe-form-modal">
        <div className="modal-content">
          <h1>{recipe ? "Edit Recipe" : "Add New Recipe"}</h1>
          {errors.server && <p>{errors.server}</p>}
          <form onSubmit={handleSubmit}>
            <label>
              Name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            {errors.name && <p>{errors.name}</p>}
            <label>
              Image URL
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
              />
            </label>
            {errors.image_url && <p>{errors.image_url}</p>}
            <label>
              Directions
              <textarea
                value={directions}
                onChange={(e) => setDirections(e.target.value)}
                required
              />
            </label>
            {errors.directions && <p>{errors.directions}</p>}
            <div className="ingredients-section">
              <h2>Ingredients</h2>
              {ingredients.map((_, i) => formRep(i))}
              <button type="button" onClick={handleAddIngredient}>
                New Ingredient
              </button>
            </div>
            <button type="submit">{recipe ? "Update" : "Add"}</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RecipeFormModal;