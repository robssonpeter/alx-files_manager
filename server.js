const express = require('express');
const router = require('./routes/index');

const app = express();

app.use(router);

const port = process.env.PORT ? process.env.PORT : 5000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
