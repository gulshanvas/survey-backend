/**
 * It contains common validation methods.
 */
class Common {
  /**
   * Is string valid ?
   *
   * @returns {boolean}
   */
  static validateString(variable) {
    return typeof variable === 'string';
  }

  /**
   * Is input a valid email?
   *
   * @param {string} email
   *
   * @returns {boolean}
   */
  static isValidEmail(email) {
    return (
      Common.validateString(email) &&
      /^[A-Z0-9]+[A-Z0-9_%+-]*(\.[A-Z0-9_%+-]{1,})*@(?:[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?\.)+[A-Z]{2,24}$/i.test(email)
    );
  }

}

module.exports = Common;