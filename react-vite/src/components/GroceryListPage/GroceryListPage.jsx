import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchGroceryLists } from "../store/groceryListsSlice";
import GroceryListDetails from "./GroceryListDetails";
import "./GroceryListPage.css";

const GroceryListPage = () => {
  const dispatch = useDispatch();
  const groceryLists = useSelector((state) => state.groceryLists.lists);
  const [selectedList, setSelectedList] = React.useState(null);

  useEffect(() => {
    dispatch(fetchGroceryLists());
  }, [dispatch]);

  return (
    <div className="grocery-list-page">
      <h1>My Grocery Lists</h1>
      <div className="list-container">
        <ul>
          {groceryLists.map((list) => (
            <li
              key={list.id}
              onClick={() => setSelectedList(list)}
              className="list-item"
            >
              {list.name} - {list.completed ? "Completed" : "Incomplete"}
            </li>
          ))}
        </ul>
      </div>
      {selectedList && <GroceryListDetails list={selectedList} />}
    </div>
  );
};

export default GroceryListPage;
