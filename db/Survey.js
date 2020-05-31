const firebaseDb = require('./init-firebase'),
  userConstants = require('../constants/user');

/**
 * Survey model.
 */
class Survey {

  /**
   * Constructor for Survey model.
   */
  constructor() {
    const oThis = this;
    oThis.surveyCollection = firebaseDb.collection('surveys');
  }

  /**
   * It formats the object.
   * @param {object} surveyObj 
   */
  formatDbData(surveyObj) {
    const surveys = [];
    if (surveyObj.size === 0) {
      return {};
    }

    surveyObj.forEach(doc => {
      const id = doc.id;
      const data = doc.data();
      surveys.push({
        id: id,
        email: data.email,
        name: data.name,
        gender: data.age,
        age: data.age,
        type: data.type,
        loginCookie: data.loginCookie || null,
        password: data.password || null
      });
    });

    return { surveys };
  }

  /**
   * It creates record in the survey model.
   * @param {object} params
   */
  async create({
    userId,
    criteria,
    formSchema,
    isAccepted,
  }) {
    const oThis = this;

    let surveyDoc = oThis.surveyCollection.add({
      userId: userId,
      criteria: JSON.parse(criteria),
      formSchema: formSchema,
      isAccepted: isAccepted || 0,
    });

    await Promise.all([surveyDoc]);
  }

  /**
   * Fetches queries based on criteria.
   * @param {*} param
   */
  async fetchByCriteria(params) {
    const minAgeRecords = await this.surveyCollection.where("criteria.minAge", "<=", params.age).get();
    const maxAgeRecords = await this.surveyCollection.where("criteria.maxAge", ">=", params.age).get();

    const minAgeFilterOnGender = this.filterOnGender(minAgeRecords, params.gender);
    const maxAgeFilterOnGender = this.filterOnGender(maxAgeRecords, params.gender);

    const uniqueRecords = [];
    for (const key in minAgeFilterOnGender) {
      if (maxAgeFilterOnGender[key].formSchema) {
        const record = {
          key: key,
          formSchema: maxAgeFilterOnGender[key].formSchema
        };

        uniqueRecords.push(record);
      }
    }

    return uniqueRecords;

  }

  /**
   * Filters the records based on gender.
   * 
   * @param {Array} records Data from model
   * @param {string} gender Gender of the user
   */
  filterOnGender(records, gender) {
    let filteredRecords = {};
    let record;
    records.forEach(doc => {
      const data = doc.data();
      if (data.criteria.gender === gender || data.criteria.gender === userConstants.anyGender) {
        filteredRecords[doc.id] = { formSchema: data.formSchema };
      }
    });
    console.log('filteredRecords : ', filteredRecords);
    return filteredRecords;
  }

  async getSurvey(params) {
    const oThis = this;
    const response = await oThis.surveyCollection.doc(params.surveyId).get();

    return response;
  }
}

module.exports = new Survey();