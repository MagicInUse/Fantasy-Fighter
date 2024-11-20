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
                pushLogin(loginData);
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
        <div className='form-container'>
            <form className='form login-form' onSubmit={handleSubmit}>
                <h1>Login</h1>
                <div className='form-group'>
                <label>Username: </label>
                <input
                    className='form-input'
                    type='text'
                    name='username'
                    value={loginData.username || ''}
                    onChange={handleChange}
                />
                </div>
                <div className='form-group'>
                <label>Password: </label>
                <input
                    className='form-input'
                    type='password'
                    name='password'
                    value={loginData.password || ''}
                    onChange={handleChange}
                />
                </div>
                <div className='form-group'>
                    <label>
                        <input
                            type='checkbox'
                            checked={newUser}
                            onChange={() => setNewUser(!newUser)}
                        />
                        {` New User`}
                    </label>
                </div>
                <div className='form-group'>
                    <button className='btn btn-primary' type='submit'>
                        {newUser ? 'Create Account & Login' : 'Login'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;