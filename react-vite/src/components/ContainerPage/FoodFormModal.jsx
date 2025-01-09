import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Removed unused `useNavigate` import
import { addFoodItems, getContainer } from "../../redux/container";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { getAllFoods } from "../../redux/food";
import './FoodFormModal.css';

function ContainerFoodFormModal() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { foods, loading } = useSelector(store => store.food);
  const [addedFoodItems, setAddedFood] = useState([{ food_name: '', food_id: '', amount: '', expiration: '' }]); // Ensured consistent naming
  // eslint-disable-next-line no-unused-vars
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  // Fetch all foods on component mount
  useEffect(() => {
    dispatch(getAllFoods());
  }, [dispatch]);

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("food items", addedFoodItems);

    const serverResponse = await dispatch(addFoodItems({ id, addedFoodItems }));

    if (serverResponse.type === "session/login/rejected") {
      setErrors(serverResponse); // Capture server errors for display
    } else {
      closeModal();
    }

    dispatch(getContainer(id));
  };

  // Updates food name and ID dynamically
  const setFoodName = (value, i) => {
    const setID = () => {
      const searchFood = foods?.find(searchFood => searchFood.name === value);
      return searchFood?.name === value ? searchFood?.id : ''; // Ensures accurate ID matching
    };

    setAddedFood(addedFoodItems.map((food, j) => 
      i === j
        ? { ...food, food_name: value, food_id: setID(food) }
        : food
    ));
  };

  // Renders the form fields for each food item
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
            type="text" // Changed type to 'text' for better semantic accuracy
            value={addedFoodItems[i].amount}
            placeholder="Optional"
            onChange={(e) =>
              setAddedFood(
                addedFoodItems.map((food, j) =>
                  i === j
                    ? { ...food, amount: e.target.value }
                    : food
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
            value={addedFoodItems[i].expiration} // Fixed missing value prop
            placeholder="Optional"
            onChange={(e) =>
              setAddedFood(
                addedFoodItems.map((food, j) =>
                  i === j
                    ? { ...food, expiration: e.target.value }
                    : food
                )
              )
            }
          />
        </label>
        {i === 0 ? null : (
          <button type="button" onClick={() => removeItem(i)}>
            Remove
          </button>
        )}
      </div>
    );
  };

  // Adds a new empty item form
  const newItem = () => {
    setAddedFood([...addedFoodItems, { food_id: '', amount: '', expiration: '' }]);
  };

  // Removes an item form
  const removeItem = (index) => {
    setAddedFood(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      {loading ? (
        <div>Loading...</div> // Display a loading message while fetching data
      ) : (
        <>
          <h1>Add Items</h1>
          <form onSubmit={handleSubmit}>
            {addedFoodItems.map((_, i) => formRep(i))} 
            <button type="button" onClick={newItem}>
              New Item
            </button>
            <button type="submit">Add Items</button> {/* Fixed casing for "Submit" */}
          </form>
        </>
      )}
    </>
  );
}

export default ContainerFoodFormModal;
