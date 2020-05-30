class UserConstants {

  get minAllowedAge() {
    return 18;
  }

  get maxAllowedAge() {
    return 90;
  }
}

module.exports = new UserConstants();