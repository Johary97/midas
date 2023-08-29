const cors = require('cors');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require("./models");

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(cors());

const ActuCrud = require('./routes/ActuCrud');
app.use('/ActuCrud', ActuCrud);

const ActuCrudSeq = require('./routes/ActuCrudSeq');
app.use('/ActuCrudSeq', ActuCrudSeq);

const ProdCrud = require('./routes/ProdCrud');
app.use('/ProdCrud', ProdCrud);

async function startServer() {
  try {
    await db.sequelize.sync();
    app.listen(8800, function () {
      console.log('Server listening on port 8800');
    });
  } catch (err) {
    console.error('Error synchronizing models:', err);
  }
}

startServer();