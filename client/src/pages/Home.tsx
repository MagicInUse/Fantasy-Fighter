import { useState, useEffect, useLayoutEffect } from "react";

import Login from "../components/Login";
import Footer from "../components/Footer";

import Auth from '../utils/auth';

// Home component that serves as the landing page of the application.
// It checks if the user is logged in and redirects to the levels page if authenticated.
const Home = () => {
    const [loginCheck, setLoginCheck] = useState(false);

    // Check if the user is logged in and redirect to levels page if authenticated
    useEffect(() => {
        if (loginCheck) {
            LoadLevels();
        }
    }, [loginCheck]);

    // Check if the user is logged in on component mount
    useLayoutEffect(() => {
        checkLogin();
    }, []);

    // Check if the user is logged in using the Auth service
    const checkLogin = () => {
        if (Auth.loggedIn()) {
            setLoginCheck(true);
        }
    };

    // Redirect to levels page
    const LoadLevels = () => {
        window.location.assign('/levels');
    };

    return (
        <>
            {/* Display the login component and footer component within the App Outlet*/}
            <Login />
            <Footer />
        </>
    );
};

export default Home;