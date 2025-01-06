import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllFoods } from "../../redux/food";
import { createGroceryList } from "../../redux/groceryListsSlice";
import "./GroceryForm.css";  // Add your styles for modal here

const GroceryForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const { foods } = useSelector((store) => store.food); // Fetch the foods from Redux state

  const [formData, setFormData] = useState({
    name: "",
    date: "",
    completed: false,
    items: [{ food_id: "", food_name: "", quantity: "", purchased: false }],
  });

  useEffect(() => {
    dispatch(getAllFoods());
  }, [dispatch]);

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
      items: [...prev.items, { food_id: "", food_name: "", quantity: "", purchased: false }],
    }));
  };

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const setFoodName = (value, i) => {
    const setID = () => {
      const searchFood = foods?.find((food) => food.name === value);
      return searchFood?.id || ""; // Ensure accurate ID matching
    };

    setFormData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[i] = { ...updatedItems[i], food_name: value, food_id: setID() };
      return { ...prev, items: updatedItems };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/groceries/new", {
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
          items: [{ food_id: "", food_name: "", quantity: "", purchased: false }],
        });
        if (onClose) {
          onClose(); // Close the modal on success
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
    <div className="modal-backdrop"> {/* Modal background */}
      <div className="grocery-form-modal"> {/* Modal container */}
        <div className="modal-content">
          <h1>Create Grocery List</h1>
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
                  <label>
                    Food Name:
                    <select
                      value={item.food_name}
                      onChange={(e) => setFoodName(e.target.value, index)}
                      required
                    >
                      <option value="">--Choose an Option--</option>
                      {foods?.map((food) => (
                        <option key={food.id} value={food.name}>
                          {food.name}
                        </option>
                      ))}
                    </select>
                  </label>
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
            <button type="button" onClick={onClose}>Cancel</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GroceryForm;






