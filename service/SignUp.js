const userModel = require('../db/User'),
  Util = require('../Util'),
  userContants = require('../constants/user'),
  CommonValidator = require('../validators/Common');

/**
 * Signup service
 */
class SignUp {

  /**
   * Constructor
   * @param {Object} params 
   * @param firstName First name of the user.
   * @param lastname Last name of the user.
   * @param email Email id.
   * @param password Password provided by the user.
   * @param age Age of the user.
   * @param gender Gender of the user.
   */
  constructor(params) {
    this.firstName = params.firstname;
    this.lastName = params.lastname;
    this.email = params.email;
    this.password = params.password;
    this.age = params.age;
    this.type = params.type;
    this.gender = params.gender;
  }

  /**
   * Main performer of the class
   */
  async perform() {

    this._validate();

    await this._isUserPresent();

    const passwordHash = Util.createPasswordHash(this.password);

    await userModel.create({
      name: this.firstName + ' ' + this.lastName,
      email: this.email,
      age: this.age,
      gender: this.gender,
      type: this.type,
      password: passwordHash
    });
  }

  /**
   * Validations.
   */
  _validate() {
    this._validateEmail();
    this._validateAge();
    this._validatePassword();
  }

  /**
   * It validates user's email id.
   */
  _validateEmail() {
    if (!CommonValidator.isValidEmail(this.email)) {
      throw new Error('email is invalid');
    }
  }

  /**
   * Validates length of password.
   */
  _validatePassword() {
    if(this.password.trim().length < userContants.minPasswordLength) {
      throw new Error('Password does not adhere to password policy');
    }
  }

  /**
   * It validates user's age.
   */
  _validateAge() {
    if (!(this.age > userContants.minAllowedAge && this.age <= userContants.maxAllowedAge)) {
      throw new Error(`Invalid age. Allowed age must be between ${userContants.minAllowedAge} and ${userContants.maxAllowedAge}`);
    }
  }

  /**
   * It verifies if the user is already present.
   */
  async _isUserPresent() {
    const isPresent = await userModel.isUserPresent(this.email);
    if (isPresent) {
      throw new Error('User already present');
    }
  }
}

module.exports = SignUp;