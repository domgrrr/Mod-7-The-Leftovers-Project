import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";
import logo from "../../../../images/freshly-logo.png";

function Navigation() {
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();
  
  
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

  return ( //added a classname for css without changing format just wrapped in a nav
    //added a div for the logo also we need to have when logo is clicked its brought to whatever our home page is
  <nav className="navbar"> 
    <div className="navbar-logo">
      <img src={logo} alt="Freshly Logo"className="navbar-logo"/> 
    </div>
    <ul className="navbar-menu">
      {user?.username ? (
        <div>
          <li>
            <NavLink to="/dash">Home</NavLink>
          </li>
          <li>
            <NavLink to="/recipes">Recipes</NavLink>
          </li>
          <li>
            <ProfileButton />
          </li>
        </div>
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
