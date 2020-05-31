const firebaseDb = require('./init-firebase');

/**
 * SurveyReporting model.
 */
class SurveyReporting {

  /**
   * Constructor for SurveyReporting model.
   */
  constructor() {
    const oThis = this;
    oThis.surveyReportingCollection = firebaseDb.collection('survey_reportings');
  }

  /**
   * It formats the object.
   * @param {object} userObj 
   */
  formatDbData(userObj) {
  }

  /**
   * It creates record in the users db.
   * @param {object} params
   */
  async create({
    surveyId,
    userId,
    response
  }) {
    const oThis = this;

    let surveyReportingDoc = oThis.surveyReportingCollection.add({
      surveyId,
      userId: userId,
      response: response,
    });

    await Promise.all([surveyReportingDoc]);
  }

  /**
   * 
   * @param {*} params 
   */
  async getSurveyReporting(params) {
    const oThis = this;

    const a = await oThis.surveyReportingCollection.where("criteria.minAge", ">=", 20).get();
    console.log(a);
  }

  /**
   * It verifies if the user has already submitted response for the survey.
   * @param {object} params 
   * @param {string} param surveyId unique survey id.
   * @param {string} param userId User id.
   */
  async isSurveyAlreadySubmittedByUser(params) {
    const oThis = this;

    const records = await oThis.surveyReportingCollection
      .where("surveyId", "==", params.surveyId)
      .where("userId", "==", params.userId)
      .get();

    return records.size > 0;
  }

  /**
   * It updates the response to the survey.
   */
  async update() {
    const oThis = this;

    await oThis.surveyReportingCollection
      .where("surveyId", "==", params.surveyId)
      .where("userId", "==", params.userId)
      .update("formResponse", params.formResponse);
  }
}

module.exports = new SurveyReporting();

// obj = new Survey();
// obj.getSurvey().then(console.log);