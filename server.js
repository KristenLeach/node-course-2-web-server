const express = require('express');
const hbs = require('hbs')
const fs = require('fs')

const port = process.env.PORT || 3000;

let app = express();

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs')

// app.use executes in the order in which it is written. First set up main logger, then maintenance, then express.static()

app.use((req, res, next) => {
    let now = new Date().toString();
    let log = `${now}: ${req.method} ${req.url}`
    console.log(log)
    fs.appendFile('server.log', `${log} /n`, (err) => {
        if (err) {
            console.log('Unable to append to server.log')
        }
    })
    next();
})

// app.use((req, res, next) => {
//     res.render('maintenance.hbs')
// })

// __dirname holds the path to node-web-server folder
// renders static files (public)
app.use(express.static(__dirname + '/public'))


hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear()
})

hbs.registerHelper('screamIt', (text) => {
    // can prepend to other variables, see home.hbs
    return text.toUpperCase()
})

app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home', 
        welcomeMessage: 'Welcome to the Home Page!'
    });
});
// handlebars looks for view file
// use app.render to render template
app.get('/about', (req, res) => {
    res.render("about.hbs", {
        pageTitle: 'About Page', 
    })
})

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: "Bad Request"
    })
})
app.listen(port, () => {
    console.log(`Server is up on port ${port}.`)
});