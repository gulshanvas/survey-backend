const Login = require('../service/Login');

loginResolver = async function ({ email, password }, context) {
  const login = new Login(email, password);

  try {
    const response = await login.perform();
    context.response.cookie("logintoken", response.userLoginToken);
    return {
      success: true,
      loginCookie: response.userLoginToken
    }
  } catch (err) {
    console.log('err : ',err);
    return {
      success: false,
      message: err.message
    }
  }
}

module.exports = { login: loginResolver };