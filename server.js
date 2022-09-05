const taskRouter = require('./routes/tasks')
const setMessage = require('./middleware/message')

require('dotenv').config()
const connectDB = require('./db/connect')
const session = require('express-session')

var express = require('express');
var app = express();
// const requiredEnvVars = ['SESSION_SECRET', 'MONGODB_URI', 'SPECIAL_SUPERSECRET'];
// requiredEnvVars.forEach((var) => {
//   if (process.env.[var] === undefined) { 
//    throw new Error(`Required environment variable ${var} is missing`);
//  }
// });

// set the view engine to ejs
app.set('view engine', 'ejs');

//set up the session

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true })); 

//invokes express middleware to parse the data that is returned when the browser posts form results.
app.use(express.urlencoded({extended: false}))

//invokes the message middleware and the routes you created
app.use('/tasks', setMessage, taskRouter)

// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {
  var mascots = [
    { name: 'Sammy', organization: "DigitalOcean", birth_year: 2012},
    { name: 'Tux', organization: "Linux", birth_year: 1996},
    { name: 'Moby Dock', organization: "Docker", birth_year: 2013}
  ];
  var tagline = "No programming concept is complete without a cute animal mascot.";

  res.render('pages/index', {
    mascots: mascots,
    tagline: tagline
  });
});

// about page
app.get('/about', function(req, res) {
  res.render('pages/about');
});

const port = 8080;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start()