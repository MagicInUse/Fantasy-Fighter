import type { UserLogin } from '../interfaces/UserLogin';

// POST /api/auth/login endpoint to login user
const login = async (userInfo: UserLogin) => {
  try {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    });

    const data = await response.json();

    // Check if the response is not OK and throw an error if login failed
    if (!response.ok) {
      throw new Error(`Failed to login with credentials`);
    }

    // Return the response data if login is successful
    return data;

  } catch (err) {
    // Reject the promise with the error if the request fails
    return Promise.reject(err);
  }
};

// POST /api/auth/create endpoint to create user
const createUser = async (userInfo: UserLogin) => {
  try {
    const response = await fetch('/auth/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    });

    const data = await response.json();

    // Check if the response is not OK and throw an error if user creation failed
    if (!response.ok) {
      throw new Error(`Failed to create new user`);
    }

    // Return the response data if user creation is successful
    return data;

  } catch (err) {
    // Reject the promise with the error if the request fails
    return Promise.reject(err);
  }
};

export { login, createUser };