//controller that fetches headlines
const db = require("../models");
const scrape = require("../scripts/scraper");

module.exports = {
    scrapeHeadlines: function(req, res) {
        return scrape()
            .then(articles => {
                return db.Headline.create(articles);
            })
            .then (dbHeadline => {
                if (dbHeadline.length === 0) {
                    res.json({
                        message: "No new articles currently available"
                    });
                }
                else {
                    res.json({
                        message:"Added ${dbHeadline.length} New Articles"
                    });
                }
            })
            .catch(err => {
                res.json({
                    message: "Article scrape complete"
                });
            });
    }
};