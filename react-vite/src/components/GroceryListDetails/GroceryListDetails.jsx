import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateGroceryList, fetchGroceryListFoods } from "../../redux/groceryListsSlice";
import GroceryForm from "../GroceryForm";
import "./GroceryListDetails.css";

const GroceryListDetails = ({ listId }) => {
  const dispatch = useDispatch();
  const list = useSelector((state) => state.groceryLists.foodsByListId[listId]);
  const foods = useSelector((state) => state.foods);
  const [addedItems, setAddedItems] = useState([{ food_name: '', food_id: '', quantity: '', purchased: false }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const foodNameToIdMap = useMemo(() => {
    return foods.reduce((map, food) => {
      map[food.name] = food.id;
      return map;
    }, {});
  }, [foods]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(fetchGroceryListFoods(listId));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [dispatch, listId]);

  const handleItemPurchase = (food_id) => {
    dispatch(updateGroceryList({ listId, food_id, purchased: true }));
  };

  const setFoodName = (value, i) => {
    setAddedItems((prev) =>
      prev.map((item, j) =>
        i === j
          ? { ...item, food_name: value, food_id: foodNameToIdMap[value] || '' }
          : item
      )
    );
  };

  const handleQuantityChange = (value, index) => {
    setAddedItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity: value } : item
      )
    );
  };

  const handleRemoveItem = (index) => {
    setAddedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await dispatch(updateGroceryList({ listId, addedItems }));
      setAddedItems([{ food_name: '', food_id: '', quantity: '', purchased: false }]);
    } catch (error) {
      console.error("Failed to submit items", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderListItems = () => {
    return list.items.map((item) => (
      <li key={item.food_id}>
        <span>{item.food_name}</span>
        <span> - Quantity: {item.quantity || "N/A"}</span>
        <button onClick={() => handleItemPurchase(item.food_id)}>
          {item.purchased ? "Purchased" : "Mark as Purchased"}
        </button>
      </li>
    ));
  };

  const renderFoodOptions = () => {
    return foods.map((food) => (
      <option key={food.id} value={food.name}>
        {food.name}
      </option>
    ));
  };

  if (list === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grocery-list-details">
      <h2>{list.name || "Unnamed List"}</h2>
      {list.items && list.items.length > 0 ? (
        <ul>{renderListItems()}</ul>
      ) : (
        <p>No items in this list.</p>
      )}
      <form onSubmit={handleSubmit}>
        {addedItems.map((item, i) => (
          <div key={`form_${i}`}>
            <label>
              Food Name
              <select
                value={item.food_name}
                onChange={(e) => setFoodName(e.target.value, i)}
                required
              >
                <option value="">--Choose an Option--</option>
                {renderFoodOptions()}
              </select>
            </label>
            <label>
              Quantity
              <input
                type="text"
                value={item.quantity}
                placeholder="Optional"
                onChange={(e) => handleQuantityChange(e.target.value, i)}
              />
            </label>
            <button type="button" onClick={() => handleRemoveItem(i)}>
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setAddedItems([
              ...addedItems,
              { food_name: '', food_id: '', quantity: '', purchased: false },
            ])
          }
        >
          Add Item
        </button>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Items"}
        </button>
      </form>
      <GroceryForm listId={listId} />
    </div>
  );
};

export default GroceryListDetails;





