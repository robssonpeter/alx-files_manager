const express = require('express');
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');
const FilesController = require('../controllers/FilesController');
const redisClient = require('../utils/redis');

const router = express.Router();
router.use(express.json());

const appController = new AppController();
const userController = new UsersController();
const authController = new AuthController();
const fileController = new FilesController();

router.get('/status', (req, res) => {
  res.send(appController.getStatus());
});

router.get('/stats', (req, res) => {
  // res.send('hello');
  appController.getStats().then((response) => {
    res.send(response);
  });
});

router.post('/users', (req, res) => {
  const { email } = req.body;
  const { password } = req.body;
  if (!email) {
    res.status(400).send({ error: 'Missing email' });
  } else if (!password) {
    res.status(400).send({ error: 'Missing password' });
  } else {
    // query into the functin to get the response
    userController.postNew(email, password).then((response) => {
      res.status(response.error ? 400 : 200).send(response);
    });
  }
});

router.get('/connect', (req, res) => {
  // get the auth data
  const auth = req.headers.authorization;
  // if the request contains the authorization header
  if (auth) {
    const authArray = auth.split(' ');

    // const buffer = Buffer.alloc(authArray[1].length, authArray[1], 'base64');
    const buffer = Buffer.from(authArray[1], 'base64').toString('utf-8');
    const credentials = buffer.split(':');
    // Check with the auth controller
    authController.getConnect(credentials[0], credentials[1], res);
  }
});

router.get('/disconnect', (req, resp) => {
  const headers = Object.keys(req.headers);
  if (headers.indexOf('x-token') > -1) {
    const token = req.headers['x-token'];
    authController.getDisconnect(token, resp);
  }
});

router.get('/users/me', (req, res) => {
  const headers = Object.keys(req.headers);
  // res.send(req.headers);
  if (headers.indexOf('x-token') > -1) {
    // there is an X-Token  passed
    const token = req.headers['x-token'];
    authController.getMe(token, res);
  } else {
    res.send('No token sent');
  }
});

router.post('/files', (req, res) => {
  const headers = Object.keys(req.headers);
  if (headers.indexOf('x-token') > -1) {
    // check if the token has a session on redis
    const token = req.headers['x-token'];
    const key = `auth_${token}`;
    redisClient.get(key).then((userId) => {
      if (userId) {
        // we can proceed with the request
        const file = req.body;
        // res.send(file)
        fileController.postUpload(file, userId, res);
      } else {
        // request can not be allowed
      }
    });
  }
});

router.get('/files/:id', (req, res) => {
  const headers = Object.keys(req.headers);
  const { id } = req.params;
  if (headers.indexOf('x-token') > -1) {
    const token = req.headers['x-token'];
    const key = `auth_${token}`;
    redisClient.get(key).then((userId) => {
      if (userId) {
        fileController.getShow(id, res);
      } else {
        // request can not be allowed
        res.status(401).send({ error: 'Unauthorized' });
      }
    });
  }
});

router.get('/files', (req, res) => {
  const headers = Object.keys(req.headers);
  const { parentId } = req.query;
  if (headers.indexOf('x-token') > -1) {
    const token = req.headers['x-token'];
    const key = `auth_${token}`;
    redisClient.get(key).then((userId) => {
      if (userId) {
        fileController.getIndex(userId, res, parentId);
      } else {
        // request can not be allowed
        res.status(401).send({ error: 'Unauthorized' });
      }
    });
  }
});

module.exports = router;
