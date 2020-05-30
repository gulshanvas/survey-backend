const firebaseDb = require('./init-firebase');

/**
 * User model.
 */
class User {

  /**
   * Constructor for user model.
   */
  constructor() {
    const oThis = this;
    oThis.usersCollection = firebaseDb.collection('users');
  }

  /**
   * It formats the object.
   * @param {object} userObj 
   */
  formatDbData(userObj) {
    const users = [];
    if (userObj.size === 0) {
      return;
    }

    userObj.forEach(doc => {
      const id = doc.id;
      const data = doc.data();
      users.push({
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

    return { users };
  }

  /**
   * It validates if user is already present
   * @param {string} email Email id of the user.
   */
  async isUserPresent(email) {
    const oThis = this;

    const records = await oThis.getUser(email);
    return records.users.length !== 0
  }

  /**
   * It fetches record from db based on the email id.
   * @param {string} email Email id of the user.
   */
  async getUser(email) {
    const oThis = this;

    const records = await oThis.usersCollection.where("email", "==", email).get();
    const formatterUser = this.formatDbData(records);

    return {
      users: formatterUser.users
    };
  }

  /**
   * It creates record in the users db.
   * @param {object} params
   */
  async create({
    name,
    email,
    type,
    age,
    gender,
    password
  }) {
    const oThis = this;

    let userDoc = oThis.usersCollection.add({
      name: name,
      email: email,
      type: type,
      age: Number(age),
      gender: gender,
      password: password
    });

    await Promise.all([userDoc]);
  }

  /**
   * It searches record based on age.
   * @param {object} params 
   */
  async searchOnAgeCriteria({ minAge, maxAge }) {

    const oThis = this;

    const records = await oThis.usersCollection
      .where('age', '>=', minAge)
      .where('age', '<=', maxAge)
      .get()
      .then(snapshot => {
        console.log('snapshot : ', snapshot);
        snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  }

  /**
   * Updates login cookie for the user
   * @param {string} id Doc id in db.
   * @param {string} userLoginCookie User login cookie
   */
  async updateLoginCookie(id, userLoginCookie) {
    const oThis = this;

    await oThis.usersCollection.doc(id).update({ loginCookie: userLoginCookie });

  }
}

module.exports = new User();


// const a = new User();

// a.get('gulshan@gmail.com').then(console.log);
// user.get('gulshan@gmail.com').then(console.log)

// user = require('/Users/gulshanvasnani/Documents/survey/db/User')
// a = { name: 'gulshan', email: 'gulshan@gmail.com', type: 'respondent', age: '20', gender: 'male', password: 'password' };
