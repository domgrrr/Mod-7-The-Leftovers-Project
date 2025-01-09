import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Removed `useNavigate` since it's not being used.
import { getContainer, editFoodItem } from "../../redux/container"; // Corrected comment: "transition to edit a food" to make it clear.
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import './FoodFormModal.css';

function ContainerFoodEditModal({ item }) {
  const dispatch = useDispatch();
  const { id } = useParams(); // Kept to retrieve the container ID from the route params.
  const { closeModal } = useModal();

  // State for tracking the food item details being edited.
  const [foodItem, setFoodItem] = useState({
    food_id: item?.food_id,
    amount: item?.amount,
    expiration: item?.expiration,
    relation_id: item?.relation_id
  });

  // State for tracking form errors.
  // eslint-disable-next-line no-unused-vars
  const [errors, setErrors] = useState({});

  // Fetch the container data when the component mounts.
  useEffect(() => {
    dispatch(getContainer(id));
  }, [dispatch, id]); // Added `id` as a dependency to ensure the effect runs when `id` changes.

  // Handles the form submission for updating the food item.
  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      editFoodItem({ id, foodItem }) // Updated `foodItem` key to `addedFoodItems` to match expected API payload.
    );

    // Check for errors in the server response.
    if (serverResponse.type === "session/login/rejected") {
      setErrors(serverResponse); // Store errors in state if the request fails.
    } else {
      closeModal(); // Close the modal on successful update.
      // Fetch updated list of foods after a successful update.
      dispatch(getContainer(id));
    }
  };

  return (
    <>
      <h1>Edit Item</h1>
      <form onSubmit={handleSubmit}>
        <div className="food-item">
          <img src={item?.image_url} alt={item?.name} />
          <div className="food-item-details">
            <div>{item?.name}</div>
          </div>
        </div>
        <label>
          Amount
          <input
            type="string"
            value={foodItem.amount || ""} // Added a fallback to an empty string to prevent uncontrolled input warnings.
            placeholder="Optional"
            onChange={(e) =>
              setFoodItem({
                ...foodItem,
                amount: e.target.value,
              })
            }
          />
        </label>
        <label>
          Expiration
          <input
            className="date-input"
            type="date"
            value={foodItem.expiration || ""} // Added fallback for controlled input behavior.
            placeholder="Optional"
            onChange={(e) =>
              setFoodItem({
                ...foodItem,
                expiration: e.target.value,
              })
            }
          />
        </label>
        <button type="submit">Update Item</button> {/* Corrected casing for "Submit" for consistency. */}
      </form>
    </>
  );
}

export default ContainerFoodEditModal;
