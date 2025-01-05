import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { addFoodItems } from "../../redux/container";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { getAllFoods } from "../../redux/food";

function ContainerFoodFormModal() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const foods = useSelector(store => store.food.foods);
  const [addedFoodItems, setAddedFood] = useState([{food_name: '', food_id: '', amount: '', expiration: ''}]);
  // const other things like amount;
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    dispatch(getAllFoods());
  }, [dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault();

    setAddedFood(addedFoodItems.map((food) => {
        const searchFood = foods?.find(searchFood => searchFood.name === food.food_name) 
        if (searchFood.name === food.food_name) return {
            ...food,
            food_id: searchFood.id
        }
        // setErrors({message: 'food does not exist'})
    }))

    console.log("food items", addedFoodItems)

    // const serverResponse = await dispatch(  
    //   addFoodItems({ id, addedFoodItems })
    // );

    // if (serverResponse.type === "session/login/rejected") {
    //   setErrors(serverResponse);
    // } else {
    //   closeModal();
    // }
  };

  const setFoodId = (value, food) => {
    console.log("VALUE", value);
    console.log("food", food);
    // currFood = foods?.find(food => food.name === value) 
    // if (currFood) return currFood?.id
    // else return food.food_id
  }

  const formRep = (i) => {
    return (
        <div key={`form_${i}`}>
            <label>
                Food Name
                <select
                    onChange = {(e) => setAddedFood(addedFoodItems.map((food, j) => i === j ? {
                        food_name: e.target.value,
                        food_id: food.food_id,
                        amount: food.amount,
                        expiration: food.expiration
                    } : food))}
                >
                {foods?.map((food, i) => <option key={`option_${i}`} value={food.name}>{food.name}</option>)}
                </select>
            </label>
            <label>
                Amount
                <input 
                    type="string"
                    value = {addedFoodItems[i].amount}
                    onChange = {(e) => setAddedFood(addedFoodItems.map((food, j) => i === j ? {
                        food_id: food.food_id,
                        amount: e.target.value,
                        expiration: food.expiration
                    } : food))}
                />
            </label>
        </div>
    )
  }

  const newItem = () => {
    setAddedFood([...addedFoodItems, {food_id: '', amount: '', expiration: ''}])
  }

  return (
    <>
      <h1>Add Items</h1>
      <form onSubmit={handleSubmit}>
        {Array.from(addedFoodItems, (_, i) => formRep(i))}
        <button type="button" onClick={newItem}>New Item</button>
        <button type="Submit">Add Items</button>
      </form>
    </>
  );
}

export default ContainerFoodFormModal;