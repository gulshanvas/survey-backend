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

  get minPasswordLength() {
    return 8
  }

  get male() {
    return "male";
  }

  get female() {
    return "female";
  }

  get anyGender() {
    return "any";
  }

}

module.exports = new UserConstants();