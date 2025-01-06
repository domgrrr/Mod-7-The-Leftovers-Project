//This will be a page that if the user isnt logged in or signed up they will be redirected to this welcome page
//after login they will be redirected to the /dash pageimport OpenModalMenuItem from "../OpenModalMenuItem";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import axios from "axios"; //installed axios to handle the demo login
import { useNavigate } from "react-router-dom";
import logo from "../../../../images/Favicon.png";
import "./WelcomePage.css";

function WelcomePage() {
    const navigate = useNavigate(); //added this line to use the navigate function

    const handleDemoLogin = async () => { //added this function to handle the demo login
        try {
            const response = await axios.post('/api/auth/login', { //added it here in the frontend because i didnt wanna add any new routes to the backend argh
                email: 'demo@aa.io',
                password: 'password',
            });
            if (response.status === 200) {
                navigate('/dash'); // Redirect to dashboard
            }
        } catch (error) {
            console.error('Demo login failed:', error); // Log any errors
        }
    };

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
                <button onClick={handleDemoLogin} className="demo-login-button"> 
                    Demo Login
                </button>
            </div>
        </div>
    );
}

export default WelcomePage;