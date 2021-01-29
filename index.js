var express = require('express');
const session = require('express-session');
// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;
require("dotenv").config();


// Requiring our models for syncing
var db = require('./models');

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000*60*60*2
    }
  }))

// Static directory
app.use(express.static('public'));

var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

const userRoutes = require("./controllers/userController");
app.use(userRoutes);

const frontEndRoutes = require("./controllers/frontEndController");
app.use(frontEndRoutes);

const reviewRoutes = require("./controllers/reviewController");
app.use("/api/reviews",reviewRoutes);

db.sequelize.sync({ force: false }).then(function() {
    app.listen(PORT, function() {
    console.log('App listening on PORT ' + PORT);
    });
});