const userConstants = require('../constants/user'),
  surveyModel = require('../db/Survey');

/**
 * Class to fetch surveys
 */  
class FetchSurveys {

  /**
   * Constructor
   * @param {object} params 
   */
  constructor(params) {
    this.userObj = params.userObj;
    this.surveyId = params.surveyId;
    this.records = [];
  }
  
  /**
   * Main performer
   */
  async perform() {
    await this._fetchSurveys();
    return this._prepareResponse();
  }

  /**
   * Fetches surveys based on criteria
   */
  async _fetchSurveys() {
    this.records = await surveyModel.fetchByCriteria({
      age: this.userObj.age,
      gender: this.userObj.gender
    });
  }

  /**
   * Prepares response
   */
  _prepareResponse() {
    return {
      records:  this.records
    };
  }
}

module.exports = FetchSurveys;