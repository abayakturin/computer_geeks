var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Computer  = require("./models/computer"),
    Comment     = require("./models/comment"),
    User        = require("./models/user");
    
//requiring routes
var commentRoutes    = require("./routes/comments"),
    computerRoutes = require("./routes/computers"),
    indexRoutes      = require("./routes/index")

var dbString = "db connectinon string";

mongoose.connect(dbString, { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "GamingPC",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/computers", computerRoutes);
app.use("/computers/:id/comments", commentRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Computer Geeks Server Has Started!");
});

// var listener = app.listen(8888, function(){
//     console.log('Listening on port ' + listener.address().port); //Listening on port 8888
// });
