const { ObjectId } = require('mongodb');
const sha1 = require('sha1');
const uuid = require('uuid');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');
const AppController = require('./AppController');

class AuthController extends AppController {
  contructor() {
    this.email = 'hello';
    this.password = 'now';
    this.projectionObject = {
      projection: {
        _id: 0,
        id: '$_id',
        email: 1,
        password: 1,
      },
    };
  }

  getConnect(email, password, responseObject) {
    this.email = email;
    this.password = password;
    // get the auth datas
    const { client } = dbClient;
    const database = client.db(dbClient.database);
    const collection = database.collection('users');
    const projectionObject = {
      projection: {
        _id: 0,
        id: '$_id',
        email: 1,
        password: 1,
      },
    };
    // return {hello: 'world'}
    return collection.findOne({ email: this.email }, projectionObject).then((user) => {
      if (!user) {
        responseObject.status(401).send({ error: 'Unauthorized' });
      }
      // return {db_password: user.password, sent_password: sha1(this.password)}
      if (sha1(this.password) === user.password) {
        // the user is authenticated
        const token = uuid.v4();
        // set the key to redis server
        const key = `auth_${token}`;
        const duration = 3600 * 24; // 24 hours

        return redisClient.set(key, user.id, duration).then(() => {
          responseObject.status(200).send({ token });
        });
      }
      return responseObject.status(401).send({ error: 'Unauthorized' });
    });
  }

  getDisconnect(token, response) {
    this.token = token;
    if (token) {
      const key = `auth_${this.token}`;
      redisClient.get(key).then((userId) => {
        if (userId) {
          redisClient.del(key).then(() => {
            response.status(204).send('');
          });
        } else {
          response.status(401).send({ error: 'Unauthorized' });
        }
      });
    } else {
      response.status(401).send({ error: 'Unauthorized' });
    }
  }

  getMe(token, responseObject) {
    // check if the token exists in the redis server
    /* console.log(redisClient.client.get()) */

    redisClient.get(`auth_${token}`).then((resp) => {
      // if there is a value
      if (resp && !resp.error) {
        // check the entry from the database
        const database = dbClient.client.db(dbClient.database);
        const collection = database.collection('users');
        this.projectionObject = {
          _id: 0,
          id: '$_id',
          email: 1,
        };
        collection.findOne({ _id: ObjectId(resp) }, {
          projection: this.projectionObject,
        }).then((res) => {
          responseObject.send(res);
        });
      } else {
        responseObject.status(401).send({ error: 'Unauthorized' });
      }
    });
  }
}
module.exports = AuthController;
