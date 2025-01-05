import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom"
import { useEffect } from "react";
import { getContainer } from "../../redux/container";
import OpenModalButton from "../OpenModalButton";
import ContainerFoodFormModal from "./FoodFormModal";

function ContainerPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const container = useSelector((store) => store.container.container)

    useEffect(() => {
        dispatch(getContainer(id));
    }, [dispatch])

    return (
        <div>
            <h1>{container?.storage_type.charAt(0).toUpperCase() + container?.storage_type.slice(1)}</h1>
            <div>
                <OpenModalButton 
                    buttonText="Add Food"
                    modalComponent={<ContainerFoodFormModal />}
                />
            </div>
            {container?.food_items.map((item, i) => (
                <div key={i}>
                    <img src={item?.image_url} alt={item?.name}/>
                    <div>{item?.name}</div>
                    <div>
                        {`${item?.amount ? (`amount: ${item?.amount}`) : ''}
                          ${item?.amount && item?.expiration ? (', ') : ''}
                          ${item?.expiration ? (`expiration: ${item?.expiration.slice(5, 16)}`) : ''}`}
                    </div>
                    <div>Buttons: remove or add to grocery</div>
                </div>
            ))}
        </div>
    )
};

export default ContainerPage;