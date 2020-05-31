const userModel = require('../../db/User'),
  surveyModel = require('../../db/Survey'),
  surveyReporting = require('../../db/SurveyReporting');

/**
 * Class is used by respondent to submit responses to surveys.
 */
class SubmitResponse {

  /**
   * Constructor
   * @param {object} params 
   */
  constructor(params) {
    this.surveyId = params.surveyId;
    this.formResponse = params.formResponse;
    this.userId = params.userId;
  }

  /**
   * Main performer.
   */
  async perform() {
    await this._validate();
    await this._submitResponse();

    // todo: update isAccepted in survey
  }

  /**
   * List of validations.
   */
  async _validate() {
    await this._validateSurveyId();
    await this._isUserAlreadyResponded();
  }

  /**
   * Validates if survey id is valid.
   */
  async _validateSurveyId() {
    const response = await surveyModel.getSurvey({surveyId: this.surveyId});
    if (!response.exists) {
      throw new Error(`Invalid survey id: ${this.surveyId}`);
    }
  }

  /**
   * Validates if the user has already submitted response to the survey.
   */
  async _isUserAlreadyResponded() {
    const isAlreadyResponded = await surveyReporting.isSurveyAlreadySubmittedByUser({
      surveyId: this.surveyId,
      userId: this.userId
    });

    if (isAlreadyResponded) {
      throw new Error(`Survey ${this.surveyId} is already submitted by user ${this.userId}`);
    }
  }

  /**
   * Submits response to survey
   */
  async _submitResponse() {

    await surveyReporting.create({
      surveyId: this.surveyId,
      userId: this.userId,
      response: this.formResponse
    });

  }
}

module.exports = SubmitResponse;