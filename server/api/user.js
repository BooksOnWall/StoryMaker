class User {
  /**
   * class constructor
   * @param {object} data
   */
  constructor() {
    this.user = [];
  }
  use(fn) {
     this.user.push(fn);
  }

}
module.exports = User;
