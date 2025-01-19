import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createGroceryList, updateGroceryList, fetchGroceryListFoods, fetchGroceryLists } from "../../redux/groceryListsSlice"
import { getAllFoods } from "../../redux/food";
import { useModal } from "../../context/Modal";
import "./GroceryForm.css";

function GroceryFormModal({ grocery, currIngredients }) {
  const dispatch = useDispatch();
  const { foods } = useSelector(store => store.food);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [ingredients, setIngredients] = useState([{ food_id: '', amount: '', purchased: false}]);
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    if (grocery) {
      setName(grocery.name);
      setDate(grocery.date);
      if (currIngredients && currIngredients.length > 0) {
        setIngredients(currIngredients.map(ing => ({
          food_id: ing.food_id,
          amount: ing.amount || '',
          purchased: ing.purchased
        })));
      }
    }
  }, [grocery, currIngredients]);

  useEffect(() => {
    dispatch(getAllFoods());
  }, [dispatch]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { food_id: '', amount: '', purchased: false}]);
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
    date,
    grocery_foods: validIngredients // Ensure this field is correctly named
  };

  console.log('!!!', newRecipe);

  // console.log("Submitting recipe:", newRecipe); // Debugging line

  const action = grocery // Check if we're editing or adding a recipe
    ? updateGroceryList({ ...newRecipe, id: grocery.id }) 
    : createGroceryList(newRecipe);
    
  const result = await dispatch(action);

  if (result.type.endsWith("rejected")) {
    setErrors(result.payload);
  } else {
    // Fetch the updated recipe details if we're editing
    if (grocery) {
      await dispatch(fetchGroceryLists()).then(
        () => dispatch(fetchGroceryListFoods(grocery.id))
      );
    }
    closeModal();
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
          <h1>{grocery ? "Edit Grocery List" : "Add New Grocery List"}</h1>
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
            {errors.image_url && <p>{errors.image_url}</p>}
            <label>
              Date
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </label>
            {errors.date && <p>{errors.date}</p>}
            <div className="ingredients-section">
              <h2>Ingredients</h2>
              {ingredients.map((_, i) => formRep(i))}
              <button type="button" onClick={handleAddIngredient}>
                New Ingredient
              </button>
            </div>
            <button type="submit">{grocery ? "Update" : "Add"}</button>
            <button type="button" onClick={() => closeModal()}>Cancel</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default GroceryFormModal;






