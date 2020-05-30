class UserConstants {

  get minAllowedAge() {
    return 18;
  }

  get maxAllowedAge() {
    return 90;
  }

  get coOrdinator() {
    return 'co-ordinator';
  }

  get respondent() {
    return 'respondent';
  }

}

module.exports = new UserConstants();