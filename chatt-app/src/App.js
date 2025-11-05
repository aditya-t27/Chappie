// import logo from './logo.svg';
import './App.css';
import Signup from './Components/LoginSignup/Signup';
import Login from './Components/LoginSignup/Login';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Homepage from './Components/feature/pages/homepage/Homepage';
import Landingpage from './Components/Landingpage/Landingpage';
import {useEffect} from "react";
import API from './api';


function App() {
  const router = createBrowserRouter([
    {
    path: "/",
    element: <Landingpage/>
    },
    {
      path: "/login",
      element: <Login/>
    },
    {
      path: "/signup",
      element: <Signup/>
    },
    {
      path: "/ui",
      element: <Homepage/>
    }
]);
useEffect(() => {
    API.get("/api/test")
      .then(res => console.log(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
   <RouterProvider router={router} />
  );
}

export default App;
