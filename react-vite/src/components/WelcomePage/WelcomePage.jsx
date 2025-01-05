//This will be a page that if the user isnt logged in or signed up they will be redirected to this welcome page
//after login they will be redirected to the /dash pageimport OpenModalMenuItem from "../OpenModalMenuItem";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import logo from "../../../../images/Favicon.png";
import "./WelcomePage.css";

function WelcomePage() {
    return (
        <div className="welcome-page">
            <div className="logo-container">
                <img src={logo} alt="Freshly Logo" className="logo" />
            </div>
            <p className="welcome-text">
                Shopping just got easier! Freshly is user-friendly to help you keep track of your produce and browse recipes!
            </p>
            <div className="welcome-images">
                <div className="image-container circle">
                    <img src="https://img.freepik.com/free-photo/top-view-kale-salad_23-2148685428.jpg" alt="kale" />
                </div>
                <div className="image-container square">
                    <img src="https://static01.nyt.com/images/2024/01/06/multimedia/06MED-DIET-SIGNUP2-vwcm/06MED-DIET-SIGNUP2-vwcm-mediumSquareAt3X.jpg" alt="breadt" />
                </div>
            </div>
            <div className="welcome-buttons">
                <OpenModalMenuItem
                    itemText="Log In"
                    modalComponent={<LoginFormModal />}
                />
                <OpenModalMenuItem
                    itemText="Sign Up"
                    modalComponent={<SignupFormModal />}
                />
            </div>
        </div>
    );
}

export default WelcomePage;