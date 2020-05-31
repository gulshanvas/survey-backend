const surveyModel = require('../../db/Survey'),
  surveyReportingModel = require('../../db/SurveyReporting');

/**
 * It is called when the co-ordinator wants to update the survey response.
 */
class UpdateResponse {

  /**
   * Constructor.
   * @param {object} params 
   */
  constructor(params) {
    this.surveyId = params.surveyId;
    this.formResponse = params.formResponse;
    this.userId = params.userId;
    this.coOrdinatorId = params.coOrdinatorId;
  }

  /**
   * Main performer of the class.
   */
  async perform() {
    await this._validate();
    await this._isUserResponded();
    await this._updateResponse();
  }

  /**
   * List of validations.
   */
  async _validate() {
    await this._validateSurveyId();
  }

  /**
   * Validates if survey id is valid.
   */
  async _validateSurveyId() {
    const response = await surveyModel.getSurvey({ surveyId: this.surveyId });
    if (!response.exists) {
      throw new Error(`Invalid survey id: ${this.surveyId}`);
    }

    if (response.data().userId !== this.coOrdinatorId) {
      throw new Error(`Co-ordinator is not owner of survey ${this.surveyId}`);
    }
  }

  /**
   * Validates if the user has already submitted response to the survey.
   */
  async _isUserResponded() {
    const isAlreadyResponded = await surveyReportingModel.isSurveyAlreadySubmittedByUser({
      surveyId: this.surveyId,
      userId: this.userId
    });

    if (!isAlreadyResponded) {
      throw new Error(`User ${this.userId} has not responded to survey ${this.surveyId}`);
    }
  }

  /**
   * Updates response to the survey by co-ordinator.
   */
  async _updateResponse() {
    await surveyReportingModel.update({
      userId: this.userId,
      surveyId: this.surveyId,
      formResponse: this.formResponse
    });
  }
}

module.exports = UpdateResponse