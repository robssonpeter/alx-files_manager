const express = require('express');

const router = express.Router();
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');

const appController = new AppController();
const userController = new UsersController();
router.use(express.json());

router.get('/status', (req, res) => {
  res.send(appController.getStatus());
});

router.get('/stats', (req, res) => {
  //res.send('hello');
  appController.getStats().then((response) => {
    res.send(response);
  });
});

router.post('/users', (req, res) => {
  const { email } = req.body;
  const { password } = req.body;
  if (!email) {
    return res.status(400).send({ error: 'Missing email' });
  }
  if (!password) {
    return res.status(400).send({ error: 'Missing password' });
  }
  // query into the functin to get the response
  return userController.postNew(email, password).then((response) => {
    if (response.error) {
      res.status(400).send(response);
    }
    res.status(201).send(response);
  });
});

module.exports = router;
