const express = require('express')
const bodyParser = require('body-parser');
const adminData = require('./routes/admin')
const shopRoutes = require('./routes/shop');
const path = require('path')
const rootDir = require('./utils/path')
// const expressHbs = require('express-handlebars') for the handlebars 

const app = express();

// app.engine('hbs',expressHbs()); for the handlebars
// app.set('view engine', 'hbs'); for the handlebars 

app.set('view engine', 'ejs');
// app.set('view engine', 'pug'); for pug 
app.set('views','views');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

app.use('/admin',adminData.route);
app.use(shopRoutes)

app.use((req,res)=>{
    // res.status(404).sendFile(path.join(rootDir,'views','404.html'));
    res.status(404).render('404',{pageTitle:'Page not found'});

})

app.listen(3000);