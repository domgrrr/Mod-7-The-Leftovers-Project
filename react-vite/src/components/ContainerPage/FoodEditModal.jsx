import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addFoodItems } from "../../redux/container"; // transition to edit a food 
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { getAllFoods } from "../../redux/food";
import './FoodFormModal.css'

function ContainerFoodEditModal({ food }) {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const { id } = useParams();
  const [foodItem, setFoodItem] = useState({food_name: food?.name, food_id: food?.food_id, amount: food?.amount, expiration: food?.expiration});
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(  
      addFoodItems({ id, food_id })
    );

    if (serverResponse.type === "session/login/rejected") {
      setErrors(serverResponse);
    } else {
      closeModal();
    }

    if (serverResponse.type === "session/login/rejected") {
      useEffect(() => {
        dispatch(getAllFoods());
      }, [dispatch])
    }
  };

  return (
    <>
        <>
        <h1>Edit Item</h1>

        <form onSubmit={handleSubmit}>
            <div className="food-item">
                    <img src={food?.image_url} alt={food?.name}/>
                    <div className="food-item-details">  
                    <div>{food?.name}</div>
                    </div>
            </div>
            <label>
                Amount
                <input 
                    type="string"
                    value = {foodItem.amount}
                    placeholder = "Optional"
                    onChange = {(e) => setFoodItem({
                        ...foodItem,
                        amount: e.target.value
                    })}
                />
            </label>
            <label>
                Expiration
                <input
                    className='date-input'
                    type='date'
                    placeholder="Optional"
                    onChange = {(e) => setFoodItem({
                        ...foodItem,
                        expiration: e.target.value
                    })}
                />
            </label>
            <button type="Submit">Add Items</button>
        </form>
        </>
    </>
  );
}

export default ContainerFoodEditModal;