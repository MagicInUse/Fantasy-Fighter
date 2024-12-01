import { type JwtPayload, jwtDecode } from 'jwt-decode';
import type { UserData } from '../interfaces/UserData';

// AuthService class to handle authentication-related operations
class AuthService {
  getProfile() {
    // Decode the JSON Web Token (JWT) using the jwtDecode function, specifying the expected payload type as UserData.
    // The getToken() method is called to retrieve the JWT, which is then passed to jwtDecode to extract and return its payload.
    return jwtDecode<UserData>(this.getToken());
  }

  // Check if the user is logged in by verifying the presence and validity of the token
  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Check if the token is expired
  isTokenExpired(token: string) {
    try {
      // Attempt to decode the provided token using jwtDecode, expecting a JwtPayload type.
      const decoded = jwtDecode<JwtPayload>(token);

      // Check if the decoded token has an 'exp' (expiration) property and if it is less than the current time in seconds.
      if (decoded?.exp && decoded?.exp < Date.now() / 1000) {
        // If the token is expired, return true indicating that it is expired.
        return true;
      }
    } catch (err) {
      // If decoding fails (e.g., due to an invalid token format), catch the error and return false.
      return false;
    }
  }

  // Retrieve the token from local storage
  getToken(): string {
    const loggedUser = localStorage.getItem('idToken') || '';
    return loggedUser;
  }

  // Save the token to local storage and redirect to the levels page
  login(idToken: string) {
    localStorage.setItem('idToken', idToken);
    window.location.assign('/levels');
  }

  // Remove the token from local storage and redirect to the home page
  logout() {
    localStorage.removeItem('idToken');
    window.location.assign('/');
  }
}

export default new AuthService();