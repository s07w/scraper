const router = require('express').Router();

// route that renders our home page
router.get("/", function(req, res) {
    res.render("home");
});

//route renders handlebars 'saved articles' 
router.get("/saved", function(req, res){
    res.render("saved");
});

module.exports = router;