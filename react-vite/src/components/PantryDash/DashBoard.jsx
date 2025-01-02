import { Link } from "react-router-dom";

function DashBoard() {
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
                <Link>All</Link>
            </div>
        </div>

    )
}

export default DashBoard;