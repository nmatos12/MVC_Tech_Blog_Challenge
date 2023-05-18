require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 3000;
const view_routes = require('./controllers/view_routes');
const auth_routes = require('./controllers/auth_routes');
const private_routes = require('./controllers/private_routes');
const sequelize = require('./config/connection');
const { engine } = require('express-handlebars');
const session = require("express-session");
const { Sequelize } = require('sequelize');
const SequelizeStore = require("connect-session-sequelize")(session.Store)

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
        db: sequelize
    })
}))

app.get(("/set-session"), (req, res) => {
    req.session.session = "session";
    res.send("Session variable set")
})

app.get("/get-session", (req, res) => {
    res.send("Session variable: ${req.session.session")
})

app.engine('hbs', engine({
    extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', './views');

app.use('/', [view_routes, auth_routes, private_routes]);

sequelize.sync().then(() => {
    app.listen(PORT, () => console.log('Server started on port %s', PORT))
});