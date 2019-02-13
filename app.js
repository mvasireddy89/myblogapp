var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var expressSession = require("express-session");
var bodyParser = require("body-parser");
var User = require("./models/userModel");
var Blog = require("./models/blogModel");
var app     = express();


    // var posts = [
    //     {
    //         postTitle:"Testing a new Blog1",
    //         postSubtitle:"This is a post subtitle test1."
    //     },
    //     {
    //         postTitle:"Testing a new Blog2",
    //         postSubtitle:"This is a post subtitle test2."
    //     },
    //     {
    //         postTitle:"Testing a new Blog3",
    //         postSubtitle:"This is a post subtitle test3."
    //     }
    // ]

// AppConfig
mongoose.connect("mongodb://localhost/MyBlogApp");
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

// Passport Config
app.use(require("express-session")({
    secret:"this is our secret sentence",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Share current user info within all routes
app.use(function(req,res, next){
    res.locals.currentUser = req.user;
    next();
});

// Routes
app.get("/", function(req, res){
    Blog.find({},function(err, posts){
        if(err){
            console.log("=========ERROR===========");
            console.log(err);
        } else {
            console.log(posts);
            res.render("home", {posts:posts});
        }
    })
    
});

app.get("/about", function(req, res){
    res.render("about");
});

app.get("/contact", function(req, res){
    res.render("contact");
});

app.get("/signup", function(req, res){
    res.render("signup");
});

app.post("/signup", function(req, res){
    // console.log(req.body)
    var newUser = new User({username:req.body.username});
    User.register(newUser, req.body.password, function(err, newCreatedUser){
        if(err){
            console.log(err);
            res.redirect("/signup");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/");
        });
    });
});

app.get("/signin", function(req, res){
    res.render("signin");
});

app.post("/signin", passport.authenticate("local",
    {
        successRedirect:"/",
        failureRedirect:"/signin"
    }), function(res, req){ });

app.get("/signout", function(req,res){
    req.logout();
    res.redirect("/");
});

app.get("/addnewblog", function(req, res){
    res.render("addNewBlog");
});

app.post("/addnewblog",function(req,res){
    var title=req.body.data.blogTitle;
    var subTitle=req.body.data.blogSubtitle;
    var comImage=req.body.data.comImage;
    var blog=req.body.data.blog;

    var newBlog = {title:title, subTitle:subTitle, comImage:comImage, blog:blog}

    Blog.create(newBlog)
    .then(function(newAddedBlog){
        console.log(newAddedBlog);
        res.status(201).json(newAddedBlog);
    })
    .catch(function(err){
        console.log("=========ERROR===========");
        console.log(err);
        res.send(err);
    })
});

app.get("/blogs/:blogId", function(req,res){
    console.log(req.params.blogId);
    
    Blog.findById(req.params.blogId)
    .then(function(foundBlog){
        res.render("blog", {foundBlog:foundBlog})
    })
    .catch(function(err){
        console.log(err);
        res.send(err);
    })
});





var server = app.listen(3000, function(err){
    if(err){
        console.log(err);
    }else
    console.log('App Started. Port Number: 3000');
});