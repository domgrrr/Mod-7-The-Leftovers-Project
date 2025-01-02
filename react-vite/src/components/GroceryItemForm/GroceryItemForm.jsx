import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addItemToGroceryList } from "../store/groceryListsSlice";
import "./GroceryItemForm.css";

const GroceryItemForm = ({ listId }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addItemToGroceryList({ listId, name, amount }));
    setName("");
    setAmount("");
  };

  return (
    <form onSubmit={handleSubmit} className="grocery-item-form">
      <input
        type="text"
        placeholder="Item Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button type="submit">Add Item</button>
    </form>
  );
};

export default GroceryItemForm;
