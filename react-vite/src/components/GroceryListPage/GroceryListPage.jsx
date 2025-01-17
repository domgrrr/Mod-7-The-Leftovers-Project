import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchGroceryLists } from "../../redux/groceryListsSlice";
import GroceryListDetails from "../GroceryListDetails";
import GroceryForm from "../GroceryForm";
import "./GroceryListPage.css";

const GroceryListPage = () => {
  const dispatch = useDispatch();
  const groceryLists = useSelector((state) => state.groceryLists.lists);
  const [selectedList, setSelectedList] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch grocery lists when the component mounts
  useEffect(() => {
    // console.log("GroceryListPage mounted. Fetching grocery lists...");
    dispatch(fetchGroceryLists());
  }, [dispatch]);

  // Automatically select the first list if available
  useEffect(() => {
    if (groceryLists?.length > 0 && !selectedList) {
      setSelectedList(groceryLists[0]);
    }
  }, [groceryLists, selectedList]);

  // Toggle the visibility of the form
  const toggleForm = () => {
    setShowForm((prev) => !prev);
    if (showForm) {
      dispatch(fetchGroceryLists());
    }
  };

  // Handle list selection
  const handleListClick = (list) => {
    console.log(`List selected: ${list.name} (ID: ${list.id})`);
    setSelectedList(list);
  };

  return (
    <div className="grocery-list-page">
      <h1>My Grocery Lists</h1>

      {/* Section to create a new grocery list */}
      <div className="grocery-list-page__create-new-list">
        <h3>Create a New Grocery List</h3>
        <button onClick={toggleForm} className="grocery-list-page__button">
          {showForm ? "Close Form" : "Add List"}
        </button>
      </div>

      {/* Display the GroceryForm when showForm is true */}
      {showForm && (
        <div className="grocery-list-page__form-container">
          <GroceryForm onClose={toggleForm} />
        </div>
      )}

      {/* Display the list of grocery lists */}
      {groceryLists?.length > 0 ? (
        <ul className="grocery-list-page__list-container" aria-label="Grocery Lists">
          {groceryLists.map((list) => (
            <li
              key={list.id}
              onClick={() => handleListClick(list)}
              className={`grocery-list-page__list-item ${
                selectedList?.id === list.id ? "selected" : ""
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleListClick(list)}
            >
              {list.name} - {list.completed ? "Completed" : "Incomplete"}
            </li>
          ))}
        </ul>
      ) : (
        <p className="grocery-list-page__no-lists">No grocery lists available. Create one to get started!</p>
      )}

      {/* Display the details of the selected grocery list */}
      {selectedList ? (
        <>
          <h2>Details for: {selectedList.name}</h2>
          <GroceryListDetails listId={selectedList.id} list={selectedList}/>
        </>
      ) : (
        <p>Select a grocery list to view its details.</p>
      )}
    </div>
  );
};

export default GroceryListPage;



