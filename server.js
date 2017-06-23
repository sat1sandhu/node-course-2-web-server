const express = require('express');
const hbs     = require('hbs');
const fs      = require('fs');

/// This is to configure our App to run on Heroku and also localhosts
const port = process.env.PORT || 3000;

/// Make a new express app
var app = express();

/// Set up to use Partial
hbs.registerPartials(__dirname + '/views/partials')

/// Set the view engine we like to use
app.set('view engine', 'hbs');

/// ********** Below registers middleware. This is done using app.use(). And it takes a function **********

/// Middleware to log Time, HTTP method and url into a file "server.log"
///  The "next exist so we can tell express when our middleware function is done
app.use ( (req, res, next) => {
    var now = new Date().toString();
    //console.log(`${now} ${req.method} ${req.url}`);

    var log = `${now} ${req.method} ${req.url}`;
    console.log(log);

    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log');
        }
    })
    next();
});

/// Middleware to indicate Site is under maintenance
/// Comment out when we don't want Site to be in maintenance Mode
// app.use( (req, res,next) => {
//     res.render('maintenance.hbs');
// })

/// Middleware to register our Express Static - Serves up the public directory
app.use(express.static(__dirname + '/public'));

/// Register a helper to return current year for the footer
hbs.registerHelper('currentYear', () => {
      return new Date().getFullYear();
});

/// Register a helper to return capital letters
hbs.registerHelper('screamIt', (text) => {
      return text.toUpperCase();
});


/// Set up all the http route handlers

/// handler for a http get request
app.get('/', (req, res) => {
      /// Use the res.send method to respond to the http request
      //res.send('<h1>Hello Express Jun</h1>');
      // res.send({
      //     name: "sat",
      //     age: 52
      // });
      res.render('home.hbs', {
          title: "Home Page",
          welcomeMessage: "Welcome to my website"//,
          //currentYear: new Date().getFullYear()
      });
});

app.get('/about', (req,res) => {
    //res.send('About Page');
    res.render('about.hbs', {
          title:"About Page"//,
          //currentYear: new Date().getFullYear()
    });
});

app.get('/bad', (req,res) => {
    res.send({
        errorMessage: 'Unable to handle request'
    });
});

/// app.listen is going to bind the application to a port on our machine
/// use port 3000 for our local machine
//app.listen(3000, () => {
app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`);
});
