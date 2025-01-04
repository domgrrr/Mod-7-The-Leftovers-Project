import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import DashBoard from '../components/PantryDash';
import GroceryListPage from '../components/GroceryListPage';
import Layout from './Layout';
import RecipePage from '../components/RecipePage/RecipePage';
import RecipeDetailsPage from '../components/RecipeDetailsPage/RecipeDetailsPage';
import ContainerPage from '../components/ContainerPage/ContainerPage';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <></>,
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
        path: "/dash",
        element: <DashBoard />
      },
      {
        path: "/container/:id",
        element: <ContainerPage />
      },
      {
        path: "/groceries",
        element: <GroceryListPage />
      },
      {
        path: "/recipes", // ADDED THE RECIPE PAGE PATH
        element: <RecipePage />,
      },
      {
        path: "/recipes/:id",
        element: <RecipeDetailsPage />,
      }
    ],
  },
]);