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

    if (!response.ok) {
      throw new Error(`Failed to login with credentials`);
    }

    return data;

  } catch (err) {
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

    if (!response.ok) {
      throw new Error(`Failed to create new user`);
    }

    return data;

  } catch (err) {
    return Promise.reject(err);
  }
};

export { login, createUser };