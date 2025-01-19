import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateGroceryList, fetchGroceryListFoods } from "../../redux/groceryListsSlice";
import { getAllFoods } from "../../redux/food";
import OpenModalButton from "../OpenModalButton";
import GroceryForm from "../GroceryForm";
import "./GroceryListDetails.css";

const GroceryListDetails = ({ listId, list }) => {
  const dispatch = useDispatch();
  // const list = useSelector((state) => state.groceryLists.foodsByListId[listId]);
  const allFoods = useSelector((state) => state.foods);
  const { foods } = useSelector((state) => state.groceryLists)
  const [addedItems, setAddedItems] = useState([{ food_name: '', food_id: '', quantity: '', purchased: false }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const foodNameToIdMap = useMemo(() => {
    return allFoods?.reduce((food) => {
      const map = {};
      // console.log("!!!", map);
      map[food.name] = food.id;
      return map;
    }, {});
  }, [allFoods]);

  useEffect(() => {
    dispatch(fetchGroceryListFoods(listId));
    dispatch(getAllFoods());
  }, [dispatch, listId]);


//updating function for hadle item purchase
  const handleItemPurchase = async (food_id) => {
    try {
      await dispatch(updateGroceryList({ 
        listId, 
        food_id,
        purchased: true 
      })).unwrap(); //unwrap will return the fulfilled value 
      
      // Refresh the list to get updated purchase status just adding for error logging to see if updating does anything
      await dispatch(fetchGroceryListFoods(listId)); // Fetching foods specific to the grocery list
    } catch (error) {
      console.error('Failed to update purchase status:', error); // Error handling
    }

  };

  const setFoodName = (value, i) => {
    const newItemList =
      addedItems?.map((item, j) =>
        i === j
          ? { ...item, food_name: value, food_id: foodNameToIdMap[value] || '' }
          : item
      )
      setAddedItems(newItemList);
  };

  const handleQuantityChange = (value, index) => {
    const newItemList = addedItems?.map((item, i) =>
      i === index ? { ...item, quantity: value } : item
    );
    setAddedItems(newItemList);
  };

  const handleRemoveItem = (index) => {
    const newItemList = addedItems?.filter((_, i) => i !== index);
    setAddedItems(newItemList);
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
    return foods?.map((item) => (
      <li key={item.food_id}>
        <span>{item.name}</span>
        <span> - Quantity: {item.amount || "N/A"}</span>
        <button onClick={() => handleItemPurchase(item.food_id)}>
          {item.purchased ? "Purchased" : "Mark as Purchased"}
        </button>
      </li>
    ));
  };

  const renderFoodOptions = () => {
    return allFoods?.map((food) => (
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
        <ul className="grocery-items-list">
          {list.items.map(({ food_id, name, quantity, purchased }) => (
            <li 
              key={food_id} 
              className={`grocery-item ${purchased ? "purchased-item" : ""}`}
            >
              {/* Item details  and purchase button section test after */}
              <div className="item-details">
                <span className="item-name">{name}</span>
                <span className="item-quantity">- {quantity || 'N/A'}</span>
              </div>
              <button 
                className={`purchase-button ${purchased ? "purchased-button" : ""}`}
                onClick={() => handleItemPurchase(food_id)}
                disabled={purchased}
              >
                {purchased ? "Purchased" : "Mark as Purchased"}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No items in this list.</p>
      )}
      {/* <form onSubmit={handleSubmit}>
        {addedItems?.map((item, i) => (
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
      </form> */}
      {/* <GroceryForm listId={listId} /> */}
    </div>
  );
};

export default GroceryListDetails;





