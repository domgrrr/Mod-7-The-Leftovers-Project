import { useDispatch, useSelector } from "react-redux"; // Importing useDispatch and useSelector hooks for Redux
import { updateGroceryList, fetchGroceryListFoods } from "../../redux/groceryListsSlice"; // Importing Redux actions
import GroceryForm from "../GroceryForm"; // Importing form component for adding items
import { useState, useEffect } from "react"; // Importing hooks for state management and side effects
import "./GroceryListDetails.css"; // Importing the CSS file for styling

const GroceryListDetails = ({ listId }) => {
  const dispatch = useDispatch(); // useDispatch hook to get access to the dispatch function
  const list = useSelector((state) => state.groceryLists.foodsByListId[listId]); // Getting the grocery list from Redux store
  const foods = useSelector((state) => state.foods); // Getting all foods from Redux store
  const [addedItems, setAddedItems] = useState([{ food_name: '', food_id: '', quantity: '', purchased: false }]); // State for new items

  // Fetch the grocery list foods on mount
  useEffect(() => {
    dispatch(fetchGroceryListFoods(listId)); // Fetching foods specific to the grocery list
  }, [dispatch, listId]);

  // Function to handle marking an item as purchased
  const handleItemPurchase = (food_id) => {
    dispatch(updateGroceryList({ listId, food_id, purchased: true }));
  };

  // Function to update food name and ID dynamically
  const setFoodName = (value, i) => {
    const setID = () => {
      const searchFood = foods?.find(food => food.name === value);
      return searchFood ? searchFood.id : ''; // Return ID based on food name
    };

    setAddedItems(addedItems.map((item, j) =>
      i === j
        ? { ...item, food_name: value, food_id: setID() }
        : item
    ));
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Dispatching an action to add new items
    await dispatch(updateGroceryList({ listId, addedItems }));
  };

  if (!list) {
    return <div>Loading...</div>; // Loading state if the list is not yet available
  }

  return (
    <div className="grocery-list-details">
      <h2>{list.name}</h2>
      <ul>
        {list.items?.map(({ food_id, name, quantity, purchased }) => (
          <li key={food_id} className={purchased ? "purchased" : ""}>
            {name} - {quantity}
            <button onClick={() => handleItemPurchase(food_id)}>
              {purchased ? "Purchased" : "Mark as Purchased"}
            </button>
          </li>
        ))}
      </ul>

      {/* Form for adding new items */}
      <form onSubmit={handleSubmit}>
        {addedItems.map((item, i) => (
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
              Quantity
              <input
                type="text"
                value={item.quantity}
                placeholder="Optional"
                onChange={(e) =>
                  setAddedItems(addedItems.map((food, j) =>
                    i === j
                      ? { ...food, quantity: e.target.value }
                      : food
                  ))
                }
              />
            </label>
            <button type="button" onClick={() => setAddedItems(addedItems.filter((_, index) => index !== i))}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={() => setAddedItems([...addedItems, { food_name: '', food_id: '', quantity: '', purchased: false }])}>
          Add Item
        </button>
        <button type="submit">Submit Items</button>
      </form>

      <GroceryForm listId={listId} />
    </div>
  );
};

export default GroceryListDetails;

