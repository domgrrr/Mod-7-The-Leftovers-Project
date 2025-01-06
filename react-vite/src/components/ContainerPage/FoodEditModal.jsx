import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getContainer, addFoodItems } from "../../redux/container"; // transition to edit a food 
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { getAllFoods } from "../../redux/food";
import './FoodFormModal.css'

function ContainerFoodEditModal({ item }) {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const { id } = useParams();
  const [foodItem, setFoodItem] = useState({food_name: item?.name, food_id: item?.food_id, amount: item?.amount, expiration: item?.expiration});
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    dispatch(getContainer(id));
  }, [dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(  
      addFoodItems({ id, addedFoodItems: foodItem }) // Rename `foodItem` to `addedFoodItems`
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
                    <img src={item?.image_url} alt={item?.name}/>
                    <div className="food-item-details">  
                    <div>{item?.name}</div>
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
            <button type="Submit">Update Item</button>
        </form>
        </>
    </>
  );
}

export default ContainerFoodEditModal;