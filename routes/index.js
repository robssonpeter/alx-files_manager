const express = require('express');

const router = express.Router();
const AppController = require('../controllers/AppController');
const appController = new AppController();

router.get('/status', (req, res) => {
  res.send(appController.getStatus());
});

router.get('/stats', (req, res) => {
  res.send(appController.getStats());
});

module.exports = router;
