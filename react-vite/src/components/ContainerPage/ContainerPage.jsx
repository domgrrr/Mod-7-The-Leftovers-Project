import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom"
import { useEffect } from "react";
import { getContainer, removeFood } from "../../redux/container";
import OpenModalButton from "../OpenModalButton";
import ContainerFoodFormModal from "./FoodFormModal";
import ContainerFoodEditModal from "./FoodEditModal";
import "./ContainerPage.css";

function ContainerPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const container = useSelector((store) => store.container.container)

    useEffect(() => {
        dispatch(getContainer(id));
    }, [dispatch, id])


    const handleRemoveFood = (relation_id) => {
        dispatch(removeFood(relation_id));
        dispatch(getContainer(id));
        window.location.reload();
    };

    return (
        <div className="container-page">
            <h1>{container?.storage_type.charAt(0).toUpperCase() + container?.storage_type.slice(1)}</h1>
            <div>
                <OpenModalButton 
                    buttonText="Add Food"
                    modalComponent={<ContainerFoodFormModal />}
                />
            </div>
            <div className="food-grid">
            {container?.food_items.map((item) => (
                <div className="food-item" key={item.id}>
                    <img src={item?.image_url} alt={item?.name}/>
                    <div className="food-item-details">  
                    <div>{item?.name}</div>
                    <div>
                        {`${item?.amount ? (`amount: ${item?.amount}`) : ''}
                          ${item?.amount && item?.expiration ? (', ') : ''}
                          ${item?.expiration ? (`expiration: ${item?.expiration.slice(5, 16)}`) : ''}`}
                    </div>
                    </div>
                    <div>
                        <button type="button"
                         onClick={() => handleRemoveFood(item?.relation_id)}>Remove Item</button>
                        <OpenModalButton 
                            buttonText="Edit Item"
                            modalComponent={<ContainerFoodEditModal item={item}/>}
                        />
                    </div>
                </div>
            ))}
        </div>
      </div>
    )
}

export default ContainerPage;