import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getAllContainers } from "../../redux/container";
import "./DashBoard.css";

function DashBoard() {
    const dispatch = useDispatch();
    const containers = useSelector((store) => store.container.containers)

    useEffect(() => {
        dispatch(getAllContainers());
    }, [dispatch]);
    

    // if (!user) {
        
    // }

    return (
        <div className="dashboard-container">
            <div className="dashboard-links top-row">
                <Link to="/recipes">Recipes</Link>
                <Link to="/groceries">Groceries</Link>
            </div>
            <div className="dashboard-links bottom-row">
                <Link to={`/container/${containers?.containers[0].id}`}>Pantry</Link>
                <Link to={`/container/${containers?.containers[1].id}`}>Fridge</Link>
                <Link to={`/container/${containers?.containers[2].id}`}>Freezer</Link>
                {/*<Link>All</Link>*/}
            </div>
        </div>

    )
}

export default DashBoard;