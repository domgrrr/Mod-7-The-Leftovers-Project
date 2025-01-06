import { useDispatch } from "react-redux"; // Importing useDispatch to dispatch Redux actions.
import { updateGroceryList } from "../../redux/groceryListsSlice"; // Importing the action to update a grocery list.
import GroceryForm from "../GroceryForm"; // Importing a form component to add items to a grocery list.
import "./GroceryListDetails.css"; // Importing the CSS file for styling.

const GroceryListDetails = ({ list }) => {
  const dispatch = useDispatch(); // useDispatch hook to get access to the dispatch function.

  //we need to add the fetchGroceryListFood thunk action to fetch the list items!!!!!!

  // Function to handle marking an item as purchased.
  const handleItemPurchase = (itemId) => {
    console.log(`Marking item with ID ${itemId} as purchased in list ${list.id}`);
    dispatch(updateGroceryList({ listId: list.id, itemId, purchased: true })); // Dispatching an action to update the grocery list.
  };

   // Check if list and list.items are defined just to avoid map error for the moment because seems like we dont have a list to map through which
   // is giving us the error at the moment
  if (!list || !list.items) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grocery-list-details">
      {/* Displaying the name of the grocery list */}
      <h2>{list.name}</h2>

      {/* Rendering the list of items in the grocery list */}
      <ul>
        {list?.items.map(({ id, name, amount, purchased }) => (
          <li key={id} className={purchased ? "purchased" : ""}>
            {/* Displaying the item's name and amount */}
            {name} - {amount}
            {/* Button to mark the item as purchased */}
            <button onClick={() => handleItemPurchase(id)}>
              {purchased ? "Purchased" : "Mark as Purchased"}
            </button>
          </li>
        ))}
      </ul>

      {/* Including a form to add new items to the grocery list */}
      <GroceryForm listId={list.id} />
    </div>
  );
};

export default GroceryListDetails;


