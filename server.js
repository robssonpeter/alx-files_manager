const express = require('express');
const bodyParser = require('./node_modules/body-parser/index');
const router = require('./routes/index');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(router);

const port = process.env.PORT ? process.env.PORT : 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
