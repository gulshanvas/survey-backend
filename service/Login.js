const userModel = require('../db/User'),
  Util = require('../Util'),
  JWTToken = require('../auth/JWT'),
  CommonValidator = require('../validators/Common');

/**
 * Login service
 */
class Login {

  /**
   * 
   * @param {string} email Email of the user 
   * @param {string} password Password of the user.
   */
  constructor(email, password) {
    this.email = email;
    this.password = password;
    this.userObj = {};
    this.userLoginToken = undefined;
  }

  /**
   * Main performer of the class.
   */
  async perform() {
    this._validate();

    await this._getUser();
    this._validatePassword();

    this._generatePayload();

    await userModel.updateLoginCookie(this.userObj.users[0].id, this.userLoginToken);

    return this._prepareResponse();

  }

  /**
   * Set of validations.
   */
  _validate() {
    this._validateEmail();
  }

  /**
   * It validates the email id of the user.
   */
  _validateEmail() {
    if (!CommonValidator.isValidEmail(this.email)) {
      throw new Error('Email is invalid');
    }
  }

  /**
   * It validates the user's password against the password stored in the db.
   */
  _validatePassword() {
    const isPasswordValid = Util.comparePassword(this.password, this.userObj.users[0].password);
    if (!isPasswordValid) {
      throw new Error('Password is invalid');
    }
  }

  /**
   * It generates the user login cookie.
   */
  _generatePayload() {
    this.userLoginToken = JWTToken.generateUserLoginToken(this.userObj);
  }

  /**
   * 
   */
  async _getUser() {
    this.userObj = await userModel.getUser(this.email);
    if (!this.userObj.users || this.userObj.users.length === 0) {
      throw new Error('User is not present. Please sign up');
    }
  }

  /**
   * Prepares response 
   */
  _prepareResponse() {
    return {
      userLoginToken: this.userLoginToken
    }
  }
}

module.exports = Login;