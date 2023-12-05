const dbClient = require('../utils/db.js');
const sha1 = require('sha1');
class UsersController{
    async postNew(email, password){
        const collection = dbClient.collection('users');
        // check if the user exists
        return collection.find({ email: email }).toArray().then((user) => {
            let inserted;
            if (!user.length) {
                // create a user account
                inserted = collection.insertOne({
                    email: email,
                    password: sha1(password)
                });
            } else {
                return { "error": "Already exist" }
            }
            return collection.findOne({ email: email });
        });
    }
}
module.exports = UsersController;