import { useState } from "react";
import { useDispatch } from "react-redux";
import { createGroceryList } from "../../redux/groceryListsSlice";

const GroceryForm = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    date: "",
    completed: false,
    items: [{ food_id: "", quantity: "", purchased: false }],
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index][field] = value;
      return { ...prev, items: updatedItems };
    });
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { food_id: "", quantity: "", purchased: false }],
    }));
  };

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createGroceryList(formData));
  };

  const { name, date, completed, items } = formData;

  return (
    <form onSubmit={handleSubmit}>
      <label>
        List Name:
        <input type="text" value={name} onChange={(e) => handleChange("name", e.target.value)} required />
      </label>
      <label>
        Date:
        <input type="date" value={date} onChange={(e) => handleChange("date", e.target.value)} />
      </label>
      <label>
        Completed:
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => handleChange("completed", e.target.checked)}
        />
      </label>
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

