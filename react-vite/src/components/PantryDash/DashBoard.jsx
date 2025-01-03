import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";

function DashBoard() {
    //TODO: 
    // const user = useSelector((store) => store.session.user);

    // if (!user) {
        
    // }

    return (
        <div>
            <div>
                <Link>Recipes</Link>
                <Link>Groceries</Link>
            </div>
            <div>
                <Link>Pantry</Link>
                <Link>Fridge</Link>
                <Link>Freezer</Link>
                {/*<Link>All</Link>*/}
            </div>
        </div>

    )
}

export default DashBoard;