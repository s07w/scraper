const axios = require("axios");
const cheerio = require("cheerio");

const scrape = function() {
    return axios.get("https://www.vulture.com/comedy/")
    .then(res => {
        const $ = cheerio.load(res.data);
        //empty array that will hold our articles
        const articles = [];

        //for each element article.item
        $("article").each((i, element) => {
            //saves data of each link enclosed in current element
            let title = $(element).find(".headline").text();
            let link = $(element).find("a").attr("href");
            let summary = $(element).find(".teaser").text();


            if (title && link && summary) {

                let dataToAdd = {
                    title: title,
                    link: link,
                    summary: summary
                };

                articles.push(dataToAdd)
            }
        });
        return articles;
    });
};

module.exports = scrape;