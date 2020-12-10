var express = require("express");
var router  = express.Router();
var Computer = require("../models/computer");
var middleware = require("../middleware");


//INDEX - show all computers
router.get("/", function(req, res){
    // Get all computers from DB
    Computer.find({}, function(err, allComputers){
       if(err){
           console.log(err);
       } else {
          res.render("computers/index",{computers:allComputers});
       }
    });
});

//CREATE - add new computer to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to computers array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var processor = req.body.processor;
    var video = req.body.video;
    var motherboard = req.body.motherboard;
    var ram = req.body.ram;
    var memory = req.body.memory;
    var power = req.body.power;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newComputer = {name: name, price: price, image: image, description: desc, processor: processor,
    video: video, motherboard: motherboard, ram: ram, memory: memory, power: power, author:author}
    // Create a new computer and save to DB
    Computer.create(newComputer, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to computers page
            console.log(newlyCreated);
            res.redirect("/computers");
        }
    });
});

//NEW - show form to create new computer
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("computers/new"); 
});

// SHOW - shows more info about one computer
router.get("/:id", function(req, res){
    //find the computer with provided ID
    Computer.findById(req.params.id).populate("comments").exec(function(err, foundComputer){
        if(err){
            console.log(err);
        } else {
            console.log(foundComputer)
            //render show template with that computer
            res.render("computers/show", {computer: foundComputer});
        }
    });
});

// EDIT COMPUTER ROUTE
router.get("/:id/edit", middleware.checkComputerOwnership, function(req, res){
    Computer.findById(req.params.id, function(err, foundComputer){
        res.render("computers/edit", {computer: foundComputer});
    });
});

// UPDATE COMPUTER ROUTE
router.put("/:id",middleware.checkComputerOwnership, function(req, res){
    // find and update the correct computer
    Computer.findByIdAndUpdate(req.params.id, req.body.computer, function(err, updatedComputer){
       if(err){
           res.redirect("/computers");
       } else {
           //redirect somewhere(show page)
           res.redirect("/computers/" + req.params.id);
       }
    });
});

// DESTROY COMPUTER ROUTE
router.delete("/:id",middleware.checkComputerOwnership, function(req, res){
   Computer.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/computers");
      } else {
          res.redirect("/computers");
      }
   });
});


module.exports = router;


