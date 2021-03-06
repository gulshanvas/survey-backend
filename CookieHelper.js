const JWT = require('./auth/JWT');

/**
 * It contains methods to validates cookies
 */
class CookieHelper {

  /**
   * Validates the login cookie of the user.
   * 
   * @param {object} request 
   */
  static validateLoginCookie(request) {
    const loginCookie = request.cookies['logintoken'];
    if(!loginCookie) {
      throw new Error('Please login in');
    }

    const decodedObject = JWT.verifyLoginCookie(loginCookie);

    return decodedObject;
  }
}

module.exports = CookieHelper;