import { useState } from "react";
import { useParams } from "react-router-dom";
import { addFoodItems } from "../../redux/container";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";

function ContainerFoodFormModal() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [addedFoodItems, setAddedFood] = useState([{food_id: '', amount: '', expiration: ''}]);
  const [numFoods, setNumFoods] = useState(1);
  // const other things like amount;
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(addedFoodItems);

    const serverResponse = await dispatch(  
      addFoodItems({ id, addedFoodItems })
    );

    if (serverResponse.type === "session/login/rejected") {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  const formRep = (i) => {
    return (
        <div key={i}>
            <label>
                Food_ID
                <input 
                    type="number"
                    value = {addedFoodItems[i].food_id}
                    onChange = {(e) => setAddedFood(addedFoodItems.map((food, j) => i === j ? {
                        food_id: e.target.value,
                        amount: food.amount,
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