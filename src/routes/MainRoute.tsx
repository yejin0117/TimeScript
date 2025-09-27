import { createBrowserRouter } from "react-router-dom";
import Home from '../components/Home';
import Settings from "../components/Settings";
//import Layout from "../layout/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/settings",
    element: <Settings />
  }
]);