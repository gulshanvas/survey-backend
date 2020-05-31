const Survey = require('../service/Survey'),
  userConstants = require('../constants/user'),
  SurveyResponse = require('../service/response/SubmitResponse'),
  UpdateResponse = require('../service/response/UpdateResponse'),
  FetchSurveys = require('../service/FetchSurveys'),
  CookieHelper = require('../CookieHelper');

/**
 * Resolver for creating the surveys by co-ordinator.
 */
createSurvey = async function ({ survey }, context) {
  try {
    const decodedUserObject = CookieHelper.validateLoginCookie(context.request);

    if (decodedUserObject.type !== userConstants.coOrdinator) {
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
 * Resolver for submission of response by respondent.
 */
submitResponse = async function ({ response }, context) {
  try {
    const decodedUserObject = CookieHelper.validateLoginCookie(context.request);
    console.log('decodedUserObject ; ', decodedUserObject);
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

/**
 * Resolver for updating response by co-ordinator.
 */
updateResponse = async function ({ response }, context) {
  try {
    const decodedUserObject = CookieHelper.validateLoginCookie(context.request);

    if (decodedUserObject.type !== userConstants.coOrdinator) {
      throw new Error('Only co-ordinator can update surveys');
    }

    const updateResponseObj = new UpdateResponse({
      surveyId: response.surveyId,
      formResponse: response.formResponse,
      userId: response.userId,
      coOrdinatorId: decodedUserObject.id
    });
    await updateResponseObj.perform();
    return {
      success: true,
      message: 'Survey updated successfully'
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}

/**
 * Resolver for fetching surveys based on criteria.
 */
fetchSurveys = async function ({ survey }, context) {
  try {
    const decodedUserObject = CookieHelper.validateLoginCookie(context.request);

    if (decodedUserObject.type !== userConstants.respondent) {
      throw new Error('Only only respondent can fetch surveys based on criteria');
    }

    fetchSurveys = new FetchSurveys({
      userObj: decodedUserObject,
      surveyId: survey
    });

    const response = await fetchSurveys.perform();

    return { 
      surveys: response.records,
      success: true,
      message: 'Surveys fetched successfully'
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
      surveys: []
    }
  }
}

module.exports = {
  createSurvey: createSurvey,
  submitResponse: submitResponse,
  updateResponse: updateResponse,
  fetchSurveys: fetchSurveys
};