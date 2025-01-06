import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import DashBoard from '../components/PantryDash';
import GroceryListPage from '../components/GroceryListPage';
import Layout from './Layout';
import RecipePage from '../components/RecipePage/RecipePage';
import RecipeDetailsPage from '../components/RecipeDetailsPage/RecipeDetailsPage';
import ContainerPage from '../components/ContainerPage/ContainerPage';
import WelcomePage from '../components/WelcomePage/WelcomePage';

// Define the ProtectedRoute component
const ProtectedRoute = ({ element }) => {
  const user = useSelector((store) => store.session.user);

  return user ? element : <Navigate to="/welcome" />;
};

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/dash"/>,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "welcome",
        element: <WelcomePage />,
      },
      {
        path: "/dash",
        element: <ProtectedRoute element={<DashBoard />}/>
      },
      {
        path: "/container/:id",
        element: <ProtectedRoute element={<ContainerPage />} />
      },
      {
        path: "/groceries",
        element: <ProtectedRoute element={<GroceryListPage />}/>
      },
      {
        path: "/groceries/:listId",
        element: <ProtectedRoute element={<GroceryListPage />} />
      },
      {
        path: "/recipes", // ADDED THE RECIPE PAGE PATH
        element: <ProtectedRoute element={<RecipePage />} />,
      },
      {
        path: "/recipes/:id",
        element:  <ProtectedRoute element={<RecipeDetailsPage />} />,
      }
    ],
  },
]);