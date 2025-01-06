import { useState } from "react";
import { useDispatch } from "react-redux";
import { createGroceryList } from "../../redux/groceryListsSlice";

const GroceryForm = ({ onClose }) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/grocery_lists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          csrf_token: document.cookie.split("=")[1], // CSRF token from cookies
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const createdList = await response.json();
        dispatch(createGroceryList(createdList));
        setFormData({
          name: "",
          date: "",
          completed: false,
          items: [{ food_id: "", quantity: "", purchased: false }],
        });
        if (onClose) {
          onClose(); // Close the form
        }
      } else {
        console.error("Failed to create grocery list");
      }
    } catch (error) {
      console.error("Error creating grocery list:", error);
    }
  };

  const { name, date, completed, items } = formData;

  return (
    <form onSubmit={handleSubmit}>
      <label>
        List Name:
        <input
          type="text"
          value={name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
      </label>
      <label>
        Date:
        <input
          type="date"
          value={date}
          onChange={(e) => handleChange("date", e.target.value)}
        />
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
              onChange={(e) =>
                handleItemChange(index, "purchased", e.target.checked)
              }
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




