class Auth {

  /**
   * Authenticate a user. Save a token string in Local Storage
   *
   * @param {obj} data
   */
  static authenticateUser(data) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('name', data.name);
    localStorage.setItem('uid', data.id);
    localStorage.setItem('userIsLoggedIn', true);
  }

  /**
   * Check if a user is authenticated - check if a token is saved in Local Storage
   *
   * @returns {boolean}
   */
  static isUserAuthenticated() {
    return localStorage.getItem('token') !== null;
  }

  /**
   * Return Items stored in localStorage
   *
   * @returns {obj}
   */
  static getDatas() {
    let user = {
      name:  localStorage.getItem('name'),
      uid: localStorage.getItem('uid'),
      userIsLoggedIn: localStorage.getItem('userIsLoggedIn')
    };
    return user;
  }

  /**
   * Deauthenticate a user. Remove a token from Local Storage.
   *
   */
  static deauthenticateUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('uid');
    localStorage.removeItem('userIsLoggedIn');
  }

  /**
   * Get a token value.
   *
   * @returns {string}
   */

  static getToken() {
    return localStorage.getItem('token');
  }

}

export default Auth;
