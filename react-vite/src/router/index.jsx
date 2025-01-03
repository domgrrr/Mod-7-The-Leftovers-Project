import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import DashBoard from '../components/PantryDash';
import GroceryListPage from '../components/GroceryListPage';
import Layout from './Layout';

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
        path: "/groceries",
        element: <GroceryListPage />
      }
    ],
  },
]);