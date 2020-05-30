var bcrypt = require('bcryptjs');

/**
 * It contains utility methods.
 */
class Util {

  /**
   * Creates password hash using salt
   * 
   * @param {string} password Password in plain text.
   */
  static createPasswordHash(password) {
    const salt = process.env.PASSWORD_SALT;
    const passwordHash = bcrypt.hashSync(password, salt);
    return passwordHash;
  }

  /**
   * Compares the password hash with password in plain text format.
   * 
   * @param {string} password Password in plain text.
   * @param {string} passwordHashInDb Hash of the password from db.
   */
  static comparePassword(password, passwordHashInDb) {
    return bcrypt.compareSync(password, passwordHashInDb);
  }
}

module.exports = Util;