const path = require('path');

const express = require('express');
var bodyParser = require('body-parser')

const userRoutes = require('./routes/user');
const Recipe = require('./models/Recipe');
const WeeklyMenu = require('./models/WeeklyMenu');
const sequelize = require('./util/database');

const rootDir = __dirname;

const app = express();
const port = process.env.PORT || 3000; // Use the provided PORT environment variable or default to 3000

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(rootDir, 'views'));


//Handles POST requests
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

//Serve static files
app.use('/public', express.static(path.join(rootDir, 'public')));

app.use('/', userRoutes);

sequelize.sync().then(result => { //{force: true}
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
);