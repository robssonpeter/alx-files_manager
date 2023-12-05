const sha1 = require('sha1');
const dbClient = require('../utils/db');

class UsersController {
  async postNew(email, password) {
    const collection = dbClient.collection('users');
    // check if the user exists
    this.email = email;
    this.passwor = password;
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
      return collection.findOne({ email: this.email });
    });
  }
}
module.exports = UsersController;
