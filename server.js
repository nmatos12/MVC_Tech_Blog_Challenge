require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 3000;
const db = require('./config/connection');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

db.sync().then(() => {
    app.listen(PORT, () => console.log('Server started on port %s', PORT))
});