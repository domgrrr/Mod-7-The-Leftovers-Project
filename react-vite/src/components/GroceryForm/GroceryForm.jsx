import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createGroceryList } from "../../redux/groceryListsSlice";

const GroceryForm = () => {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [completed, setCompleted] = useState(false);
  const [items, setItems] = useState([{ food_id: "", quantity: "", purchased: false }]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { food_id: "", quantity: "", purchased: false }]);
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newGroceryList = { name, date, completed, items };
    dispatch(createGroceryList(newGroceryList));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>List Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div>
        <label>Completed:</label>
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
        />
      </div>
      <div>
        <label>Items:</label>
        {items.map((item, index) => (
          <div key={index}>
            <input
              type="number"
              placeholder="Food ID"
              value={item.food_id}
              onChange={(e) => handleItemChange(index, "food_id", e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
              required
            />
            <input
              type="checkbox"
              checked={item.purchased}
              onChange={(e) => handleItemChange(index, "purchased", e.target.checked)}
            />
            <button type="button" onClick={() => removeItem(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addItem}>
          Add Item
        </button>
      </div>
      <button type="submit">Create Grocery List</button>
    </form>
  );
};

export default GroceryForm;
