import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchGroceryLists } from "../../redux/groceryListsSlice";
import GroceryListDetails from "../GroceryListDetails";
import "./GroceryListPage.css";

const GroceryListPage = () => {
  const dispatch = useDispatch();
  const groceryLists = useSelector((state) => state.groceryLists.lists);
  const [selectedList, setSelectedList] = useState(null);

  useEffect(() => {
    dispatch(fetchGroceryLists());
  }, [dispatch]);

  const handleListClick = (list) => setSelectedList(list);

  return (
    <div className="grocery-list-page">
      <h1>My Grocery Lists</h1>
      <ul className="list-container">
        {groceryLists.map((list) => (
          <li
            key={list.id}
            onClick={() => handleListClick(list)}
            className="list-item"
          >
            {list.name} - {list.completed ? "Completed" : "Incomplete"}
          </li>
        ))}
      </ul>
      {selectedList && <GroceryListDetails list={selectedList} />}
    </div>
  );
};

export default GroceryListPage;

