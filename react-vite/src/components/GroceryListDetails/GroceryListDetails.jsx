import { useDispatch } from "react-redux"; // Importing useDispatch to dispatch Redux actions.
import { updateGroceryList } from "../../redux/groceryListsSlice"; // Importing the action to update a grocery list.
import { fetchGroceryListFoods } from "../../redux/groceryListsSlice"; // Importing the action to fetch a grocery list's foods.
import GroceryForm from "../GroceryForm"; // Importing a form component to add items to a grocery list.
import "./GroceryListDetails.css"; // Importing the CSS file for styling.
import { useSelector } from "react-redux"; // Importing the useSelector hook to get access to the Redux store.
import { useEffect } from "react"; // Importing the useEffect hook to run side effects in function components.


const GroceryListDetails = ({ listId }) => {
  const dispatch = useDispatch(); // useDispatch hook to get access to the dispatch function.
  const list = useSelector((state) => state.groceryLists.foodsByListId[listId]); // Getting the grocery list from the Redux 
  
  //we need to add the fetchGroceryListFood thunk action to fetch specific grocery list foods
  
  useEffect(() => {
    dispatch(fetchGroceryListFoods(listId)); // Fetching the grocery list foods using thunk action.
  }, [dispatch, listId]); // Dependency array ensures this runs only when `dispatch` or `listId` changes.

  // Function to handle marking an item as purchased.
  const handleItemPurchase = (food_id) => { //changed id to food_id for clarity
    console.log(`Marking item with ID ${food_id} as purchased in list ${listId}`);
    dispatch(updateGroceryList({ listId, food_id, purchased: true })); // Dispatching an action to update the grocery list.
  };

   // Check if list and list.items are defined this is also to avoid the map error!
  if (!list) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grocery-list-details">
      {/* Displaying the name of the grocery list */}
      <h2>{list.name}</h2>

      {/* Rendering the list of items in the grocery list */}
      <ul>
        {list.map(({ food_id, name, amount, purchased }) => (
          <li key={food_id} className={purchased ? "purchased" : ""}>
            {/* Displaying the item's name and amount */}
            {name} - {amount}
            {/* Button to mark the item as purchased */}
            <button onClick={() => handleItemPurchase(food_id)}>
              {purchased ? "Purchased" : "Mark as Purchased"} 
            </button>
          </li>
        ))}
      </ul>

      {/* Including a form to add new items to the grocery list */}
      <GroceryForm listId={listId} />
    </div>
  );
};

export default GroceryListDetails;


