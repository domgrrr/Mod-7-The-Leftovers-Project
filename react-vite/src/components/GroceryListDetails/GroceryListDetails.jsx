import React from "react";
import { useDispatch } from "react-redux";
import { updateItemStatus, addItemToGroceryList } from "../store/groceryListsSlice";
import GroceryItemForm from "./GroceryItemForm";
import "./GroceryListDetails.css";

const GroceryListDetails = ({ list }) => {
  const dispatch = useDispatch();

  const handleItemPurchase = (itemId) => {
    dispatch(updateItemStatus({ listId: list.id, itemId, purchased: true }));
  };

  return (
    <div className="grocery-list-details">
      <h2>{list.name}</h2>
      <ul>
        {list.items.map((item) => (
          <li key={item.id} className={item.purchased ? "purchased" : ""}>
            {item.name} - {item.amount}
            <button onClick={() => handleItemPurchase(item.id)}>
              {item.purchased ? "Purchased" : "Mark as Purchased"}
            </button>
          </li>
        ))}
      </ul>
      <GroceryItemForm listId={list.id} />
    </div>
  );
};

export default GroceryListDetails;
