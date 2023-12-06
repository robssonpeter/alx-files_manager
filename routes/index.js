const express = require('express');
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');

const router = express.Router();
router.use(express.json());

const appController = new AppController();
const userController = new UsersController();
const authController = new AuthController();

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

module.exports = router;
