const express = require('express');

const router = express.Router();
const appController = require('../controllers/AppController');

router.get('/status', (req, res) => {
  res.send(appController.getStatus());
});

router.get('/stats', (req, res) => {
  res.send(appController.getStats());
});

router.get('/hello', (req, res) => {
  res.send('hello there here you are');
});

module.exports = router;
