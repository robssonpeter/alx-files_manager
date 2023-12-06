const sha1 = require('sha1');
const dbClient = require('../utils/db');

class UsersController {
  async postNew(email, password) {
    /* console.log(dbClient);
    return {} */
    const database = dbClient.client.db(dbClient.database);
    const collection = database.collection('users');
    // check if the user exists
    this.email = email;
    this.password = password;
    return collection.find({ email: this.email }).toArray().then((user) => {
      if (!user.length) {
        // create a user account
        collection.insertOne({
          email: this.email,
          password: sha1(this.password),
        });
      } else {
        return { error: 'Already exist' };
      }
      return collection.findOne({ email: this.email }, { projection: { email: 1, _id: 0, id: '$_id' } });
    });
  }
}
module.exports = UsersController;
