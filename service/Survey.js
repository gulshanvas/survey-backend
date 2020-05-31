const surveyModel = require('../db/Survey');

/**
 * Survey service
 */
class Survey {

  /**
   * Constructor.
   * @param {object} survey 
   */
  constructor(survey) {
    this.formSchema = survey.formSchema;
    this.criteria = survey.criteria;
    this.userObj = survey.userObj;
  }

  /**
   *
   */
  async perform() {
    await this.createNewSurvey();
  }

  /**
   * 
   */
  async createNewSurvey() {
    await surveyModel.create({
      userId: this.userObj.id,
      criteria: this.criteria,
      formSchema: this.formSchema
    }
    );
  }
}

module.exports = Survey;