// import React from "react";
import { useDispatch } from "react-redux";
import { updateGroceryList } from "../../redux/groceryListsSlice";
import GroceryForm from "../GroceryForm";
import "./GroceryListDetails.css";

const GroceryListDetails = ({ list }) => {
  const dispatch = useDispatch();

  const handleItemPurchase = (itemId) => {
    dispatch(updateGroceryList({ listId: list.id, itemId, purchased: true }));
  };

  return (
    <div className="grocery-list-details">
      <h2>{list.name}</h2>
      <ul>
        {list.items.map(({ id, name, amount, purchased }) => (
          <li key={id} className={purchased ? "purchased" : ""}>
            {name} - {amount}
            <button onClick={() => handleItemPurchase(id)}>
              {purchased ? "Purchased" : "Mark as Purchased"}
            </button>
          </li>
        ))}
      </ul>
      <GroceryForm listId={list.id} />
    </div>
  );
};

export default GroceryListDetails;

