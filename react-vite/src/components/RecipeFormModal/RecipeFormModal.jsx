import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addRecipe, updateRecipe } from "../../redux/recipeslice";
import "./RecipeFormModal.css";

function RecipeFormModal({ recipe, onClose }) {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [directions, setDirections] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (recipe) {
      setName(recipe.name);
      setImageUrl(recipe.image_url);
      setDirections(recipe.directions);
    }
  }, [recipe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newRecipe = {
      name,
      image_url: imageUrl,
      directions,
    };

    const action = recipe ? updateRecipe({ ...newRecipe, id: recipe.id }) : addRecipe(newRecipe);
    const result = await dispatch(action);

    if (result.type.endsWith("rejected")) {
      setErrors(result.payload);
    } else {
      onClose();
    }
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
            <button type="submit">{recipe ? "Update" : "Add"}</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RecipeFormModal;