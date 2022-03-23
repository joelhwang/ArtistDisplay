if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const CustomError = require('./helpers/CustomError');
const artpieceRoutes = require('./routes/artpieces');
const userRoutes = require('./routes/authUsers');
const homeRoutes = require('./routes/home');
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');


//'mongodb://localhost:27017/artist-display'

//const dbUrl = process.env.DB_URL;
const dbUrl = 'mongodb://localhost:27017/artist-display';
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use('/public', express.static('public'));
app.use(mongoSanitize());

const sessionConfig = {
    store: MongoStore.create({
        mongoUrl: dbUrl,
        touchAfter: 24 * 60 * 60
    }),
    name: 'session',
    secret: 'goodsecret',
    resave: false,
    saveUnitialized: true,
    cookie:{
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(
    helmet.contentSecurityPolicy({
      useDefaults: true,
      directives: {
        "img-src": ["'self'", "https: data:"]
      }
    })
  )

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/user', userRoutes);
app.use('/artpieces', artpieceRoutes);
app.use('/', homeRoutes);

app.all('*', (req, res, next)=>{
    next(new CustomError('Page Not Found', 404))
})

app.use((err, req, res, next)=>{
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Something went wrong'
    res.status(statusCode).render('error', {err})
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})