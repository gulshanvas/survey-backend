const firebaseDb = require('./init-firebase');

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
   * 
   * @param {*} param
   */
  async buildCriteria({
    age: age,
    gender: gender,
  }) {
    // query based on minAge and maxAge - sruveys
    // apply filter for opposite gender for logged in user -- 
  }

  async getSurvey(params) {
    const oThis = this;
    const response = await oThis.surveyCollection.doc(params.surveyId).get();

    return response;
  }
}

module.exports = new Survey();

// obj = new Survey();
// obj.getSurvey().then(console.log);