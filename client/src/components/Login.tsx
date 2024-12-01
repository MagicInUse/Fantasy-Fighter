import { useState, type FormEvent, type ChangeEvent } from 'react';

import Auth from '../utils/auth';
import { login, createUser } from '../api/authAPI';

import type { UserLogin } from '../interfaces/UserLogin';

const Login = () => {
    const [loginData, setLoginData] = useState<UserLogin>({
        username: '',
        password: '',
    });
    const [newUser, setNewUser] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [alertMessage, setAlertMessage] = useState<string>('');

    // Handle input changes for login data
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
        ) => {
        const { name, value } = e.target;
        setLoginData({
            ...loginData,
            [name]: value,
        });
    };

    // Handle input changes for confirm password field
    const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
    };

    // Handle form submission for login or user creation
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Check if passwords match when creating a new user
        if (newUser && loginData.password !== confirmPassword) {
            setAlertMessage('Error: Passwords do not match');
            return;
        }

        // Handle login for existing user
        if (!newUser) {
            try {
                await pushLogin(loginData);
            } catch (err) {
                setAlertMessage(`${err}`);
            }
        }

        // Handle user creation and login for new user
        if (newUser) {
            try {
                await createUser(loginData);
                await pushLogin(loginData);
            } catch (err) {
                setAlertMessage(`${err}`);
            }
        }
    };

    // Function to handle login and set authentication token
    const pushLogin = async (loginData: UserLogin) => {
        try {
            const data = await login(loginData);
            Auth.login(data.token);
        }
        catch (err) {
            setAlertMessage(`${err}`);
        }
    };

    return (
        <div className='form-container d-flex justify-content-center align-items-center mt-5'>
            <div className="col-md-6 card border-secondary p-5 mt-5 login-card">
                <form className='form login-form' onSubmit={handleSubmit}>
                    <h1 className="text-center mb-4">Login</h1>
                    <div className='form-group mb-3'>
                    <label className="form-label">Username: </label>
                    <input
                        className='form-control'
                        type='text'
                        name='username'
                        value={loginData.username || ''}
                        onChange={handleChange}
                    />
                    </div>
                    <div className='form-group'>
                    <label className="form-label">Password: </label>
                    <input
                        className='form-control'
                        type='password'
                        name='password'
                        value={loginData.password || ''}
                        onChange={handleChange}
                    />
                    </div>
                    {newUser && (
                        <div className='form-group mb-3'>
                            <label className="form-label">Confirm Password: </label>
                            <input
                                className='form-control'
                                type='password'
                                name='confirmPassword'
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                            />
                        </div>
                    )}
                    <div className='form-group mt-3 mb-3'>
                        <label className="form-check-label">
                            <input
                                className="form-check-input"
                                type='checkbox'
                                checked={newUser}
                                onChange={() => setNewUser(!newUser)}
                            />
                            {` New User`}
                        </label>
                    </div>
                    <div className='form-group text-center'>
                        <button className='btn btn-primary w-25' type='submit'>
                            {newUser ? 'Create Account & Log In' : 'Login'}
                        </button>
                    </div>
                </form>
                {alertMessage && (
                    <div className='alert alert-danger mt-3'>
                        {alertMessage}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;