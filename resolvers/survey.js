const Survey = require('../service/Survey'),
  userConstants = require('../constants/user'),
  SurveyResponse = require('../service/response/SubmitResponse'),
  CookieHelper = require('../CookieHelper');

createSurvey = async function ({ survey }, context) {
  try {
    const decodedUserObject = CookieHelper.validateLoginCookie(context.request);

    if(decodedUserObject.type !== userConstants.coOrdinator) {
      return {
        success: false,
        message: 'Only co-ordinator can create surveys'
      }
    }

    const surveyObj = new Survey({
      formSchema: survey.formSchema,
      criteria: survey.criteria,
      userObj: decodedUserObject
    });
    await surveyObj.perform();
    return {
      success: true,
      message: 'Survey created successfully'
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}

/**
 * It is called when respondent submits his response to survey.
 */
submitResponse = async function ({ response }, context) {
  try {
    const decodedUserObject = CookieHelper.validateLoginCookie(context.request);
    console.log('decodedUserObject ; ',decodedUserObject);
    if (decodedUserObject.type !== userConstants.respondent) {
      return {
        success: false,
        message: 'Only respondent can submit the response to the survey.'
      }
    }

    const surveyResponseObj = new SurveyResponse({
      surveyId: response.surveyId,
      formResponse: response.formResponse,
      userId: decodedUserObject.id
    });
    await surveyResponseObj.perform();
    return {
      success: true,
      message: 'Survey response submitted successfully'
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}

module.exports = { 
  createSurvey: createSurvey,
  submitResponse: submitResponse
 };