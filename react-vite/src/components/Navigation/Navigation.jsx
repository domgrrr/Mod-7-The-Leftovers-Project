import { NavLink, useLocation } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";
import logo from "../../../../images/Freshly2.png";

function Navigation() {
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();
  const location = useLocation(); // Get the current location object so /welcome route so no navbar loads

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
  
    document.addEventListener("click", closeMenu);
  
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);
  
  const closeMenu = () => setShowMenu(false);

  if (!user) {
    return null; // Do not render the navigation bar if the user is not authenticated
  }
  if (location.pathname === '/welcome') {
    return null;
  } // Do not render the navigation bar if the user is on the welcome page


  return ( //added a classname for css without changing format just wrapped in a nav
    //added that when logo is clicked it redirects to /dash (Home Page)
    //added a div for the logo also we need to have when logo is clicked its brought to whatever our home page
  <nav className="navbar"> 
    <div className="navbar-logo"> 
    <NavLink to="/dash"> 
          <img src={logo} alt="Freshly Logo" className="navbar-logo" /> 
        </NavLink>
    </div>
    <ul className="navbar-menu">
      {user?.username ? (
        <>
          <li>
            <NavLink to="/dash">Home</NavLink>
          </li>
          <li>
            <NavLink to="/recipes/user">Manage Recipes</NavLink>
          </li>
          <li>
            <ProfileButton />
          </li>
        </>
      ) : (
        <>
          <OpenModalMenuItem
            itemText="Log In"
            onItemClick={closeMenu}
            modalComponent={<LoginFormModal />}
          />
          <OpenModalMenuItem
            itemText="Sign Up"
            onItemClick={closeMenu}
            modalComponent={<SignupFormModal />}
          />
        </>
      )}
    </ul>
  </nav> 
  );
}

export default Navigation;
