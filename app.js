var express= require("express"),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    flash = require("connect-flash"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    seedDB = require("./seeds"),
    methodOverride = require("method-override")
//require routes
var  commentRoutes= require("./routes/comments"),
     campgroundRoutes= require("./routes/campgrounds"),
     indexRoutes= require("./routes/index");




//seedDB();

//PASSPORT CONFIG

app.use(require("express-session")({
    secret: "Cool secret",
    resave: false,
    saveUninitialized: false
}));

// mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect("mongodb+srv://sharath:Rajampeta@21@cluster0-8x6vp.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));




app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})




// app.use(function(req, res, next){
//     res.locals.currentUser = req.user
//     next();
// })


app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT ||  3000, function() {
  console.log('YelpCamp has started');
});



