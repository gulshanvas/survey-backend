const jwtToken = require('jsonwebtoken');

/**
 * Class which provides helper methods to generate and verify secure jwt tokens
 */
class JWTToken {

  static generateToken(payload) {
    const secretToken = jwtToken.sign(payload, process.env.JWT_SECRET_KEY, {
      algorithm: 'HS256',
      expiresIn: 30 * 2
    });
    return secretToken;
  }

  static verifyLoginCookie(loginCookie) {
    let decodedObject;
    try {
      const object = jwtToken.decode(loginCookie);
      decodedObject = jwtToken.verify(loginCookie, process.env.JWT_SECRET_KEY);
    } catch (err) {
      console.log('error in verifying ', err);
    }
    return decodedObject;
  }

  static generateUserLoginToken(userObj) {
    const user = userObj.users[0];
    const payload = { 
      email: user.email,
      gender: user.gender,
      type: user.type, 
      age: user.age
    };
    return JWTToken.generateToken(payload);

  }

}

module.exports = JWTToken;