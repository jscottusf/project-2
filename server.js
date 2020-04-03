if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const exphbs = require("express-handlebars");
const db = require("./models");
const app = express();
const PORT = process.env.PORT || 8080;
const paginate = require('express-paginate');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const handlebars = require('handlebars'),
    layouts = require('handlebars-layouts');
 
layouts.register(handlebars);



// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')));
//Pagination Middleware
app.use(paginate.middleware(9, 20));


// var app = express();
var hbs = exphbs.create({ 
  /* config */
  defaultLayout: "main", 
});

// Register `hbs.engine` with the Express app.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


// Register helpers 
handlebars.registerHelper(layouts(handlebars));

// Register partials 
handlebars.registerPartial('index', fs.readFileSync('views/index.handlebars', 'utf8'));
handlebars.registerPartial('catalogue', fs.readFileSync('views/catalogue.handlebars', 'utf8'));
handlebars.registerPartial('brand', fs.readFileSync('views/partials/brand.handlebars', 'utf8'));
handlebars.registerPartial('category', fs.readFileSync('views/partials/category.handlebars', 'utf8'));
handlebars.registerPartial('pagination', fs.readFileSync('views/partials/pagination.handlebars', 'utf8'));
handlebars.registerPartial('product_list_item', fs.readFileSync('views/partials/product_list_item.handlebars', 'utf8'));
handlebars.registerPartial('product_list', fs.readFileSync('views/partials/product_list.handlebars', 'utf8'));

// Routes
require("./config/mongo")(app);
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);
require("./routes/locationRoutes")(app);
require("./routes/profileRoutes")(app);
require('./routes/router.register')(app);






var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}


// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
