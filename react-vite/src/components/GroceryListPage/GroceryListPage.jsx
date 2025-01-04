import React, { useEffect, useState } from "react"; // Importing necessary React hooks.
import { useSelector, useDispatch } from "react-redux"; // Importing Redux hooks.
import { fetchGroceryLists } from "../../redux/groceryListsSlice"; // Importing the action to fetch grocery lists from the Redux slice.
import GroceryListDetails from "../GroceryListDetails"; // Importing the GroceryListDetails component.
import "./GroceryListPage.css"; // Importing the CSS file for styling.

const GroceryListPage = () => {
  const dispatch = useDispatch(); // Getting the dispatch function to trigger actions.
  const groceryLists = useSelector((state) => state.groceryLists.lists); // Selecting the grocery lists from the Redux store.
  const [selectedList, setSelectedList] = useState(null); // Local state to keep track of the currently selected list.

  // Fetch the grocery lists when the component mounts.
  useEffect(() => {
    console.log("Fetching grocery lists...");
    dispatch(fetchGroceryLists()); // Dispatching the action to fetch grocery lists.
  }, [dispatch]); // Dependency array ensures this runs only when `dispatch` changes (typically just once).

  // Handles when a user clicks on a list name.
  const handleListClick = (list) => {
    console.log(`Selected list: ${list.name}`);
    setSelectedList(list); // Updating the local state with the selected list.
  };

  return (
    <div className="grocery-list-page">
      <h1>My Grocery Lists</h1>

      {/* Displaying the list of grocery lists */}
      <ul className="list-container">
        {groceryLists.map((list) => (
          <li
            key={list.id} // Using the list ID as a unique key for each list.
            onClick={() => handleListClick(list)} // Setting the selected list when clicked.
            className="list-item"
          >
            {/* Displaying the name and completion status of the list */}
            {list.name} - {list.completed ? "Completed" : "Incomplete"}
          </li>
        ))}
      </ul>

      {/* Displaying the details of the selected grocery list */}
      {selectedList ? (
        <>
          <h2>Details for: {selectedList.name}</h2>
          <GroceryListDetails list={selectedList} />
        </>
      ) : (
        <p>Select a grocery list to view its details.</p>
      )}
    </div>
  );
};

export default GroceryListPage;

