import { useState, useEffect, useLayoutEffect } from "react";

import Login from "../components/Login";

import Auth from '../utils/auth';

const Home = () => {
    const [loginCheck, setLoginCheck] = useState(false);

    useEffect(() => {
        if (loginCheck) {
            LoadLevels();
        }
    }, [loginCheck]);

    useLayoutEffect(() => {
        checkLogin();
    }, []);

    const checkLogin = () => {
        if (Auth.loggedIn()) {
            setLoginCheck(true);
        }
    };

    const LoadLevels = () => {
        window.location.assign('/levels');
    };

    return (
        <>
            <Login />
        </>
    );
};

export default Home;