import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRecipe, updateRecipe } from "../../redux/recipeslice";
import { getAllFoods } from "../../redux/food";
import "./RecipeFormModal.css";

function RecipeFormModal({ recipe, onClose }) {
  const dispatch = useDispatch();
  const { foods } = useSelector(store => store.food);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [directions, setDirections] = useState("");
  const [ingredients, setIngredients] = useState([{ food_name: '', food_id: '', amount: '', expiration: '' }]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (recipe) {
      setName(recipe.name);
      setImageUrl(recipe.image_url);
      setDirections(recipe.directions);
      setIngredients(recipe.ingredients || []);
    }
  }, [recipe]);

  useEffect(() => {
    dispatch(getAllFoods());
  }, [dispatch]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { food_name: '', food_id: '', amount: '', expiration: '' }]);
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const setFoodName = (value, i) => {
    const setID = () => {
      const searchFood = foods?.find(searchFood => searchFood.name === value);
      return searchFood?.name === value ? searchFood?.id : '';
    };

    setIngredients(ingredients.map((ingredient, j) =>
      i === j
        ? { ...ingredient, food_name: value, food_id: setID() }
        : ingredient
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newRecipe = {
      name,
      image_url: imageUrl,
      directions,
      recipe_foods: ingredients
    }

    const action = recipe ? updateRecipe({ ...newRecipe, id: recipe.id }) : addRecipe(newRecipe);
    const result = await dispatch(action);

    if (result.type.endsWith("rejected")) {
      setErrors(result.payload);
    } else {
      onClose();
    }
  };

  const formRep = (i) => {
    return (
      <div key={`form_${i}`}>
        <label>
          Food Name
          <select
            onChange={(e) => setFoodName(e.target.value, i)}
            required
          >
            <option value="">--Choose an Option--</option>
            {foods?.map((food, i) => (
              <option key={`option_${i}`} value={food.name}>
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
            onChange={(e) =>
              setIngredients(
                ingredients.map((ingredient, j) =>
                  i === j
                    ? { ...ingredient, amount: e.target.value }
                    : ingredient
                )
              )
            }
          />
        </label>
        <label>
          Expiration
          <input
            className="date-input"
            type="date"
            value={ingredients[i].expiration}
            placeholder="Optional"
            onChange={(e) =>
              setIngredients(
                ingredients.map((ingredient, j) =>
                  i === j
                    ? { ...ingredient, expiration: e.target.value }
                    : ingredient
                )
              )
            }
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
