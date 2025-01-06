import { Link, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getAllContainers } from "../../redux/container";
import { FaBook, FaShoppingCart, FaWarehouse, FaSnowflake, FaBoxOpen } from 'react-icons/fa';
import "./DashBoard.css";

function DashBoard() {
    const dispatch = useDispatch();
    const { user, loading } = useSelector((store) => store.session);
    const containers = useSelector((store) => store.container.containers)

    if (!user) {
        return <Navigate to="/welcome" />; //why isnt this working?
    }
    useEffect(() => {
        dispatch(getAllContainers()); //once loading is done, it is set to false
    }, [dispatch]);

    if (loading) { //if loading is true render message, if loading is false then continue on to returning containers
        return <div>Loading...</div>;
    }

    return (
        <>
        {loading ? (
            <div>Loading</div>
        ) : (
            <div className="dashboard-container">
                <h1>Your Dashboard</h1>
                <div className="dashboard-links top-row">
                    <Link to="/recipes">
                        <FaBook /> Recipes
                    </Link>
                    <Link to="/groceries">
                    <FaShoppingCart /> Groceries
                    </Link>
                </div>
                <div className="dashboard-links bottom-row">
                    <Link to={`/container/${containers?.containers[0]?.id}`}>
                    <FaBoxOpen /> Pantry
                    </Link>
                    <Link to={`/container/${containers?.containers[1]?.id}`}>
                    <FaWarehouse /> Fridge
                    </Link>
                    <Link to={`/container/${containers?.containers[2]?.id}`}>
                    <FaSnowflake /> Freezer
                    </Link>
                    {/*<Link>All</Link>*/}
                </div>
            </div>

        )}
        </>
    )
}

export default DashBoard;