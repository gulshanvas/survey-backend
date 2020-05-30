const SignUp = require('../service/SignUp');

signUpResolver = async function ({ userInfo }, context) {
  const signUp = new SignUp(userInfo, context);

  try {
    await signUp.perform();
    return {
      success: true,
      message: 'User created successfully'
    }
  } catch (err) {
    console.log('err : ',err);
    return {
      success: false,
      message: err.message
    }
  }
}

module.exports = { signup: signUpResolver };