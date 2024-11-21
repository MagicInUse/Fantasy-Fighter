import { useState, type FormEvent, type ChangeEvent } from 'react';

import Auth from '../utils/auth';
import { login, createUser } from '../api/authAPI';
import type { UserLogin } from '../interfaces/UserLogin';

const Login = () => {
    const [loginData, setLoginData] = useState<UserLogin>({
        email: '',
        username: '',
        password: '',
    });

    const [newUser, setNewUser] = useState(false);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
        ) => {
        const { name, value } = e.target;
        setLoginData({
            ...loginData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!newUser) {
            try{
                pushLogin(loginData);
            }
            catch (err) {
                console.error('Failed to login', err);
            }
        }
        
        if (newUser) {
            try {
                createUser(loginData);
                setNewUser(!newUser);
            }
            catch (err) {
                console.error('Failed to create user', err);
            }
        }
    };

    const pushLogin = async (loginData: UserLogin) => {
        try {
            const data = await login(loginData);
            Auth.login(data.token);
        }
        catch (err) {
            console.error('Failed to login', err);
        }
    };

    return (
        <div className='form-container d-flex justify-content-center align-items-center mt-5'>
            <div className="col-md-6 card border-secondary p-5 mt-5">
            <form className='form login-form' onSubmit={handleSubmit}>
                <h1 className="text-center mb-4">Login</h1>
                {/* TODO: Get w/ Hailey to see if we want only email or username or all */}
                <div className='form-group mb-3'>
                <label className="form-label">Email: </label>
                <input
                    className='form-control'
                    type='text'
                    name='email'
                    value={loginData.email || ''}
                    onChange={handleChange}
                />
                </div>
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
                        {newUser ? 'Create Account' : 'Login'}
                    </button>
                </div>
            </form>
            </div>
        </div>
    );
};

export default Login;