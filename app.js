
const {globalVariables} = require('./config/configuration');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const exphbs = require('express-handlebars');
const {mongoDbUrl, PORT} = require('./config/configuration');
const flash = require('connect-flash');
const session = require('express-session'); 
const methodOverride = require('method-override');
const {selectOption} = require('./config/customFunctions');
const fileUpload = require('express-fileupload');
const passport = require('passport');

const app = express();


//   cấu hình mongoose
mongoose.connect(mongoDbUrl, { useNewUrlParser: true })
    .then(response => {
        console.log("MongoDB Connected Successfully.");
    }).catch(err => {
        console.log("Database connection failed.");
});


// cấu hình express.
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));


//Flash and Session
app.use(session({
    secret: 'anysecret',
    saveUninitialized: true,
    resave: true
}));

app.use(flash());

// Passport 
app.use(passport.initialize());
app.use(passport.session());


app.use(globalVariables);


// File Upload Middleware
app.use(fileUpload());

// cài đặt tempalate engine
app.engine('hbs', exphbs({extname:'hbs',defaultLayout: 'default', helpers: {select: selectOption}}));
app.set('view engine' , 'hbs');


// Method Override
app.use(methodOverride('newMethod'));


// routes
const defaultRoutes = require('./routes/defaultRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/', defaultRoutes);
app.use('/admin', adminRoutes);


// start
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
