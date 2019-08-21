class Auth {

  /**
   * Authenticate a user. Save a token string in Local Storage
   *
   * @param {obj} data
   */
  static authenticateUser(data) {

    let prefs = data.prefs;
    localStorage.setItem('token', data.token);
    localStorage.setItem('name', data.name);
    localStorage.setItem('uid', data.id);
    localStorage.setItem('userIsLoggedIn', true);
    console.log(prefs);
    let p = prefs.map( pref => ({ name: pref.pname, nvalue: pref.pvalue}));
    for (var i = 0; i < p.length; i++) {
      p[i].nvalue = JSON.parse(p[i].nvalue);
      localStorage.setItem(p[i].name, p[i].nvalue.value);
    }
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
      userIsLoggedIn: localStorage.getItem('userIsLoggedIn'),
      avatar: localStorage.getItem('avatar'),
      theme: localStorage.getItem('theme'),
      locale: localStorage.getItem('locale')
    };
    return user;
  }
  /**
   * Return Items stored in localStorage
   *
   * @returns {obj}
   */
  static updateAvatar(path) {
    console.log(path);
    localStorage.setItem('avatar', path);
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
    localStorage.removeItem('theme');
    localStorage.removeItem('locale');
    localStorage.removeItem('avatar');
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
