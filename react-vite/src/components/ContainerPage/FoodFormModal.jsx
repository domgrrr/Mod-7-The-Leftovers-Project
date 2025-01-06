import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addFoodItems } from "../../redux/container";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { getAllFoods } from "../../redux/food";
import './FoodFormModal.css'

function ContainerFoodFormModal() {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const { id } = useParams();
  const { foods, loading } = useSelector(store => store.food);
  const [addedFoodItems, setAddedFood] = useState([{food_name: '', food_id: '', amount: '', expiration: ''}]);
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    dispatch(getAllFoods());
  }, [dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("food items", addedFoodItems)

    const serverResponse = await dispatch(  
      addFoodItems({ id, addedFoodItems })
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

  const setFoodName = (value, i) => {

    const setID = () => {
        const searchFood = foods?.find(searchFood => searchFood.name === value) 
        if (searchFood?.name === value) return searchFood?.id
        return ''
    }

    return setAddedFood(addedFoodItems.map((food, j) => i === j ? {
        food_name: value,
        food_id: setID(food),
        amount: food.amount,
        expiration: food.expiration
    } : food))
  };

  const formRep = (i) => {
    return (
        <div key={`form_${i}`}>
            <label>
                Food Name
                <select
                    onChange = {(e) => setFoodName(e.target.value, i)}
                    required
                >
                <option value="">--Choose an Option--</option>
                {foods?.map((food, i) => <option key={`option_${i}`} value={food.name}>{food.name}</option>)}
                </select>
            </label>
            <label>
                Amount
                <input 
                    type="string"
                    value = {addedFoodItems[i].amount}
                    placeholder = "Optional"
                    onChange = {(e) => setAddedFood(addedFoodItems.map((food, j) => i === j ? {
                        food_id: food.food_id,
                        amount: e.target.value,
                        expiration: food.expiration
                    } : food))}
                />
            </label>
            <label>
                Expiration
                <input
                    className='date-input'
                    type='date'
                    placeholder="Optional"
                    onChange = {(e) => setAddedFood(addedFoodItems.map((food, j) => i === j ? {
                      food_id: food.food_id,
                      amount: food.amount,
                      expiration: e.target.value
                  } : food))}
                />
            </label>
            {i === 0 ? null : (<button type="button" onClick={() => removeItem(i)}>Remove</button>)}
        </div>
    )
  }

  const newItem = () => {
    setAddedFood([...addedFoodItems, {food_id: '', amount: '', expiration: ''}])
  };

  const removeItem = (index) => {
    setAddedFood((prev) => (prev.filter((_, i) => i !== index)));
  };

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
        <h1>Add Items</h1>
        <form onSubmit={handleSubmit}>
            {Array.from(addedFoodItems, (_, i) => formRep(i))}
            <button type="button" onClick={newItem}>New Item</button>
            <button type="Submit">Add Items</button>
        </form>
        </>
      )}

    </>
  );
}

export default ContainerFoodFormModal;