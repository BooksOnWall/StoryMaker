class Story {
  /**
   * class constructor
   * @param {object} data
   */
  constructor() {
    this.story = [];
  }
  use(fn) {
     this.story.push(fn);
  }

}
module.exports = Story;
